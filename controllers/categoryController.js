const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const path = require("path");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

function deleteImage(filePath) {
  // Construct the full path to the image file
  const fullPath = "public" + filePath;
  // Check if the file exists
  if (fs.existsSync(fullPath) && !filePath.includes("-default.")) {
    // File exists, delete it
    fs.unlinkSync(fullPath);
  }
}

//Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name imageUrl").sort({ name: 1 }).exec();
  res.render("categories_list", {
    title: "All Categories",
    categories: allCategories,
  });
});

//Display detail for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({ category: req.params.id }).sort({ name: 1 }).exec()]);
  res.render("category_detail", {
    category: category,
    categoryItems: categoryItems,
  });
});

//Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

//Handle category create on POST.
exports.category_create_post = [
  upload.single("image"),
  //Validate and sanitize the field.
  body("name", "Category must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),

  //Process after validation and sanitization
  asyncHandler(async (req, res, next) => {
    //Extract errors from the request.
    const errors = validationResult(req);

    const imageUrl = req.file ? req.file.path.replace(/^public/, "") : "/images/placeholder-default.webp";
    //Create new Category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, description: req.body.description, imageUrl: imageUrl, authorized: true });

    if (!errors.isEmpty()) {
      //There are errors. Render the form again with the sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        errors: errors.array(),
        category: category,
      });
      return;
    } else {
      //Data is valid.
      await category.save();
      res.redirect(category.url);
    }
  }),
];

//Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({ category: req.params.id }).sort({ name: 1 }).exec()]);
  res.render("category_delete", {
    title: `Delete Category:${category.name}`,
    category: category,
    categoryItems: categoryItems,
  });
});

//Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({ category: req.params.id }).sort({ name: 1 }).exec()]);
  if (categoryItems.length > 0) {
    res.render("category_delete", {
      title: `Delete Category:${category.name}`,
      category: category,
      categoryItems: categoryItems,
    });
    return;
  } else {
    deleteImage(category.imageUrl);
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

//Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

//Handle category update on POST.
exports.category_update_post = [
  upload.single("image"),
  //Validate and sanitize the field.
  body("name", "Category must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  //Process after validation and sanitization
  asyncHandler(async (req, res, next) => {
    //Extract errors from the request.
    const errors = validationResult(req);

    const imageUrl = req.file ? req.file.path.replace(/^public/, "") : "/images/placeholder-default.webp";

    //Create new Category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, description: req.body.description, _id: req.params.id, imageUrl: imageUrl, authorized: true });

    if (!errors.isEmpty()) {
      //There are errors. Render the form again with the sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        errors: errors.array(),
        category: category,
      });
      return;
    } else {
      //Data is valid.
      await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(category.url);
    }
  }),
];
