const User = require('../model/user')
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const {connectDatabase} = require('../config/database')

const getUser = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    User.find({},function(err,user){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": false, data: user})
        }
    })
}


const updateUser = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    User.findByIdAndUpdate(mongoose.Types.ObjectId(String(req.params.id)), req.body, function(err,user){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": false, data: user})
        }
    })
}

const deleteUser = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    User.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err,user){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": false, message: 'user deleted'})
        }
    })
}

module.exports = {
    deleteUser,
    getUser,
    updateUser
}