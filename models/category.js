const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, require: true },
  authorized: { type: Boolean, default: false },
});

//virtual for category's URL
CategorySchema.virtual("url").get(function () {
  return `/inventory/category/${this._id}`;
});

//Export model
module.exports = mongoose.model("Category", CategorySchema);
