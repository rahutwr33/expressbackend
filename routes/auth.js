var express = require('express');
const {login,register} = require('../controller/auth');
var router = express.Router(); //create instance

router.post('/login',  login); 
router.post('/signup',  register); 

module.exports = router;
