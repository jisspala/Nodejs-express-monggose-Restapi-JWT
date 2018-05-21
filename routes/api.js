var express = require('express')
var router = express.Router();
var Auth = require('../controllers/Auth.js');
var User= require('../controllers/User.js');
router.post('/login',User.login);
router.post('/',User.addUser);
// Auth middleware check user token valid?
router.get('/', Auth,User.getUser);
router.put('/',Auth,User.updateUser);
module.exports = router