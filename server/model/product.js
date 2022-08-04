const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
//   author: ObjectId,
coverImage: String,
name: { type: String, require: true, max:[60, '最大６０文字までです'] },
price: Number,
description: String,
headding1: String,
headding2: String,
headding3: String,
headingtext1: String,
headingtext2: String,
headingtext3: String
});

module.exports = mongoose.model('product', ProductSchema )