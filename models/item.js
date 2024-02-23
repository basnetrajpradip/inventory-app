const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

//virtual for item's URL
ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
