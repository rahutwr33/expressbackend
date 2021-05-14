var express = require('express');
const {deleteProduct,getProduct,saveProduct,updateProduct, uploadImage} = require('../controller/product');
var router = express.Router(); //create instance
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage: storage })

// Register routes
/* GET users listing. */
router.get('/',  getProduct); 
router.post('/', saveProduct); 
router.post('/upload', upload.single('avatar'), uploadImage);
router.put('/:id', updateProduct); 
router.delete('/:id', deleteProduct);

// exports router instance
module.exports = router;
