const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Product = require('../model/product')
const {connectDatabase} = require('../config/database')
const elasticsearch = require("elasticsearch");
const esClient = elasticsearch.Client({
  host: "http://127.0.0.1:9200",
})

const saveProduct = async function(req,res){
    const dbcon = await connectDatabase(); 
    const newUser = new Product(req.body);
    newUser.save().then(() => {
        Product.on('es-indexed', function(err, res){
            if (err) throw err;
            dbcon.connection.close() //close connection
            return res.status(200).json({"success": true, message: "product created"})
        })
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
    const searchText = req.query.search;
    esClient.search({
        index: "products",
        body: {
            query: {
                match: {"name": searchText.trim()},
            },
            "aggs": {
                "docs": {
                  "top_hits": {
                    "size": 1
                  }
                }
              }
        }
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        return res.status(500).json({"message": "Error"})
    })
    // Product.find({},function(err,product){
    //     if(err){
    //         return res.status(401).json({"success": false, message: err.toString()});
    //     }else{
    //         dbcon.connection.close() //close connection 
    //         return res.status(200).json({"success": true, data: product})
    //     }
    // })
}


const updateProduct = async function(req,res){
    const dbcon = await connectDatabase();  //connect to database common method
    Product.findByIdAndUpdate(mongoose.Types.ObjectId(String(req.params.id)), req.body, function(err,product){
        if(err){
            return res.status(500).json({"success": false, message: err.toString()});
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
            return res.status(500).json({"success": false, message: err.toString()});
        }else{
            Product.on('es-removed', function(err, res) {
                if (err) throw err;
                dbcon.connection.close() //close connection 
                return res.status(200).json({"success": true, message: 'product deleted'})
              });
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