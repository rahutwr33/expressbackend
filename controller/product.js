const Product = require('../model/product')
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const {connectDatabase} = require('../config/database')
const saveProduct = async function(req,res){
    const dbcon = await connectDatabase(); 
    const newUser = new Product(req.body);
    newUser.save().then(() => {
        console.log('data save');
        dbcon.connection.close() //close connection
        return res.status(200).json({"success": true, message: "product created"})
    }).catch(err => {
        dbcon.connection.close() //close connection
        return res.status(500).json({"success": false, message: err.toString()})
    })
}

const uploadImage = async function(req,res){
    console.log("file", req.file);
    return res.status(200).json({"success": true, message: 'file uploaded'})
}

const getProduct = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    Product.find({},function(err,product){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": true, data: product})
        }
    })
}


const updateProduct = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    Product.findByIdAndUpdate(mongoose.Types.ObjectId(String(req.params.id)), req.body, function(err,product){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": true, data: product})
        }
    })
}

const deleteProduct = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    Product.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err,product){
        if(err){
            return res.status(401).json({"success": false, message: err.toString()});
        }else{
            dbcon.connection.close() //close connection 
            return res.status(200).json({"success": true, message: 'product deleted'})
        }
    })
}

module.exports = {
   saveProduct,
   getProduct,
   updateProduct,
   deleteProduct,
   uploadImage
}