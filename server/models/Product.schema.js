var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// var ProductSchema = new Schema({
//   handle:{type:String, required:true},
//   title:{type:String, required:true},
//   body:{type:String, required:true},
//   vendor:{type:String, required:true},
//   type:{type:String, required:true},
//   tags:{type:String, required:true},
//   published:{type:String, required:true},
//   variants:{type:[{}]}
// });
// var ProductSchema = new Schema({
//   handle:{type:String},
//   title:{type:String},
//   body:{type:String},
//   vendor:{type:String},
//   type:{type:String},
//   tags:{type:String},
//   published:{type:String},
//   variants:{type:[{}]}
// });
var ProductSchema = new Schema({
  title:{type:String},
  variants:{type:[{}]}
});
// console.log("mongoose schema",mongoose.db, mongoose);
module.exports = mongoose.model('productDetails', ProductSchema,'productDetails');
