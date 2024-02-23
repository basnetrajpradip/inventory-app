const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

exports.index = (req, res, next) => {
  res.render("index");
};

//Display list of all items
exports.item_list = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item list");
};

//Display detail for a specific item.
exports.item_detail = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
};

//Display item create form on GET.
exports.item_create_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

//Handle item create on POST.
exports.item_create_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

//Display item delete form on GET.
exports.item_delete_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

//Handle item delete on POST.
exports.item_delete_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

//Display item update form on GET.
exports.item_update_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

//Handle item create on POST.
exports.item_update_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};
