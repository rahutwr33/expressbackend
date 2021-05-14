var express = require('express');
const { deleteUser,getUser,updateUser } = require('../controller/user');
var router = express.Router(); //create instance
const getToken = function (req,res,next) {
    if (req.headers && req.headers.authorization) {
      var parted = req.headers.authorization.split(' ');
      if (parted.length === 2) {
        next();
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
// Register routes
/* GET users listing. */
router.get('/', getToken, getUser); 
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser);

// exports router instance
module.exports = router;
