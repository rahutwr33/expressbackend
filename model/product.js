const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongooseProfiler = require('mongoose-profiler');

const ProductSchema = new Schema({
  name: {type: String, required: true, unique: true},
  price: Number,
  quantity:   Number,
  image: String,
  category: String,
  isdeleted: { type: Boolean, default: false },
},{ timestamps: true},
{autoIndex:true});

ProductSchema.plugin(mongooseProfiler({
  isAlwaysShowQuery: true,
  duration: 1000,          // Show query plans when it took more than this time (ms).
  totalDocsExamined: 1000, // Show query plans when "totalDocsExamined" more than this value.
  level: 'COLLSCAN'        // Show query plans when the stage is "COLLSCAN".
}));
module.exports = mongoose.model('product', ProductSchema);
