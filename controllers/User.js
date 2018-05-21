var express = require('express')
var jwt = require('jsonwebtoken');
var config = require('../appConfig'); // All config file
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../model/user');
var router = express.Router();
var empty = require('is-empty');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
exports.addUser=function (req, res) {
    if(empty(req.body.name))
    {
      return res.json({"Error":"Name required"})
    }
    else  if(empty(req.body.email))
    {
      return res.json({"Error":"email required"})
    }
    else  if(empty(req.body.password))
    {
      return res.json({"Error":"password required"})
    } 
    else  if(empty(req.body.address))
    {
      return res.json({"Error":"address required"})
    }
    else
    {
        User.findOne({email: req.body.email}, function(err, testuser) 
        {
            if (err) res.json({"Error":err});
            if (testuser)
            {
                res.json({"Error":"already has an account"});
            }
            else
            {
                User.create({name: req.body.name,email: req.body.email,password: req.body.password,address: req.body.address}, function (err, user) {
                if (err) return res.json({"Error":err});
                var token = jwt.sign({ id: user._id }, config.mysecret, {
                expiresIn: 43200 // expires in 12 hours
                });
                res.json({ id: user._id,auth: true, token: token, Message:"Please use this token for authentication , send x-access-token as header"});
                });
            }
        });
    }
}
exports.login=function (req, res)
 {
    User.findOne({email: req.body.email,loginAttempts: {$gt: 3}} ,{lockUntil:1}, function(err, testuser) 
    {
        if (err) throw err;
        if (testuser)
        {
            res.json({"Error":"Please try after some time"});
        }
        else
        {
            User.findOne({email: req.body.email, password:req.body.password}, function(err, user) {
                if (err) throw err;
                if (!user) 
                {
                    User.findOneAndUpdate({email: req.body.email},{ $inc: { loginAttempts: 1 },lockUntil:Date.now() }, function(err, user) {
                       // console.log('count updated'+err);
                      });
                      return res.json({Error:"No user found."});
                }
                else
                {
                User.findOneAndUpdate({email: req.body.email},{ loginAttempts: 0,lockUntil:0 }, function(err, user) {
                        //console.log('count updated');
                      });
                var token = jwt.sign({ id: user._id }, config.mysecret, {
                    expiresIn: 43200 // expires in 12 hours
                  });
                  res.json({ id: user._id,auth: true, token: token, Message:"Please use this token for authentication , send x-access-token as header"});
                } 
            });

        }
    });

}
exports.getUser=function (req, res) {
    User.find({_id: req.userId},{name:1,email:1,address:1}, function(err, users) {
      if (err) throw err;
      res.json(users);
    });
}
exports.updateUser=function (req, res) {
    let newValues={};
    if(!empty(req.body.name))
    {
        newValues.name=req.body.name;
    }
    else  if(!empty(req.body.address))
    {
        newValues.address=req.body.address;
    }
    User.findOneAndUpdate({_id: req.userId},newValues, function(err, user) {
      if (err) res.json(err);
      res.json({"Updated":"yes"});
    });
}