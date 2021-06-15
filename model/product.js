const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongooseProfiler = require('mongoose-profiler');
const mongoosastic = require('mongoosastic')
const ProductSchema = new Schema({
  name: { type: String, required: true, unique: true, es_indexed: true },
  price: { type: Number },
  quantity: Number,
  image: String,
  category: { type: String, es_indexed: true },
  description:{ type: String, es_indexed: true },
  isdeleted: { type: Boolean, default: false },
}, { timestamps: true },
  { autoIndex: true });

ProductSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
});

var Product =  mongoose.model('product', ProductSchema);
Product.createMapping({
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "classic",
          "char_filter": [ "my_pattern" ],
          "filter": ["lowercase"]
         }
      },
      "char_filter": {
        "my_pattern": {
          "type": "pattern_replace",
          "pattern": "\\.",
          "replacement": " "
        }
      }
    }
   },
   "mappings": {
     "product": {
       "dynamic_templates": [{
         "strings": {
           "match_mapping_type": "string",
           "mapping": {
             "type": "text",
             "fields": {
               "keyword": {
                 "type": "keyword"
               }
             }
           }
         }
      }],
      "properties": {
        "title": {
          "type": "text",
          "analyzer": "my_analyzer"
      },
      "category": {
        "type": "keyword"
      }
    }
   },
  }
 }, (err, mapping) => {
  if (err) {
    console.log(err);
  } else {
    console.log(mapping);
  }
});

var stream = Product.synchronize();

stream.on('error', function (err) {
  console.log(`err`, err)
})

module.exports = Product
