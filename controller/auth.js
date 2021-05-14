const User = require('../model/user')
const {connectDatabase} = require('../config/database')
const jwt = require('jsonwebtoken');
const login = async function(req,res){
    const dbcon = await connectDatabase(); 
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            dbcon.connection.close() //close connection
            throw err;
        }
        if (!user) {
            dbcon.connection.close() //close connection
            res.status(401).send({success: false, msg: 'Authentication failed. user not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.sign({"_id": user._id}, process.env.SECRET);
                    dbcon.connection.close() //close connection
                    // return the information including token as JSON
                    return res.json({success: true, token: 'JWT ' + token});
                } else {
                    dbcon.connection.close() //close connection
                    return res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
}
const register = async function(req,res){
    const dbcon = await connectDatabase(); 
    const newUser = new User(req.body);
    newUser.save().then(() => {
        dbcon.connection.close() //close connection
        return res.status(200).json({"success": true, message: "user created"})
    });
}

module.exports = {
    login,
    register,
}