const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

//Display list of all Categories
exports.category_list = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category list");
};

//Display detail for a specific category.
exports.category_detail = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category detail: ${req.params.id}`);
};

//Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category create GET");
};

//Handle category create on POST.
exports.category_create_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category create POST");
};

//Display category delete form on GET.
exports.category_delete_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete GET");
};

//Handle category delete on POST.
exports.category_delete_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

//Display category update form on GET.
exports.category_update_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

//Handle category create on POST.
exports.category_update_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
