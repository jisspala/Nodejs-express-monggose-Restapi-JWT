var jwt = require('jsonwebtoken');
var config = require('../appConfig'); // All config file
module.exports=function(req, res, next) {

  var token = req.headers['x-access-token'];
  console.log(token);
  if (!token) 
    return res.json({ auth: false, message: 'No token' });

  jwt.verify(token, config.mysecret, function(err, decoded) {      
    if (err) 
      return res.json({ auth: false, message: 'Failed to authenticate token.'+err });    
    req.userId = decoded.id;
    next();
  });
}