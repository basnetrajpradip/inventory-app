const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

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
exports.category_create_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

//Display category update form on GET.
exports.category_create_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

//Handle category create on POST.
exports.category_create_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
