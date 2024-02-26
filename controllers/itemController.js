const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
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

//Display index page
exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([Category.countDocuments({}).exec(), Item.countDocuments({}).exec()]);

  res.render("index", {
    category_count: numCategories,
    item_count: numItems,
  });
});

//Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name category imageUrl").populate("category").sort({ name: 1 }).exec();
  res.render("item_list", {
    title: "All Items",
    items: allItems,
  });
});

//Display detail for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  res.render("item_detail", {
    item: item,
  });
});

//Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name").sort({ name: 1 }).exec();
  res.render("item_form", {
    title: "Create Item",
    categories: categories,
  });
});

//Handle item create on POST.
exports.item_create_post = [
  upload.single("image"),

  //validate and sanitize the field.
  body("name", "Category must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Price must not be empty.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a numeric value")
    .custom((value, { req }) => {
      if (value <= 0) {
        throw new Error("Price must be greater than 0.");
      }
      return true;
    })
    .escape(),
  body("stock").trim().isLength({ min: 1 }).withMessage("In Stock value must not be empty").isNumeric({ min: 0 }).withMessage("In Stock must be a numeric value").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const categories = await Category.find({}, "name").sort({ name: 1 }).exec();

    const imageUrl = req.file ? req.file.path.replace(/^public/, "") : "/images/placeholder-default.webp";

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: imageUrl,
      authorized: true,
    });

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Create Item",
        categories: categories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

//Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  res.render("item_delete", {
    item: item,
    title: `Delete Item: ${item.name}`,
  });
});

//Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.body.itemid).exec();
  deleteImage(item.imageUrl);
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/inventory/items");
});

//Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([Item.findById(req.params.id).exec(), Category.find({}, "name").sort({ name: 1 }).exec()]);
  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: categories,
  });
});

//Handle item update on POST.
exports.item_update_post = [
  upload.single("image"),
  //validate and sanitize the field.
  body("name", "Category must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Price must not be empty.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a numeric value")
    .custom((value, { req }) => {
      if (value <= 0) {
        throw new Error("Price must be greater than 0.");
      }
      return true;
    })
    .escape(),
  body("stock").trim().isLength({ min: 1 }).withMessage("In Stock value must not be empty").isNumeric({ min: 0 }).withMessage("In Stock must be a numeric value").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const categories = await Category.find({}, "name").sort({ name: 1 }).exec();

    const imageUrl = req.file ? req.file.path.replace(/^public/, "") : "/images/placeholder-default.webp";

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
      imageUrl: imageUrl,
      authorized: true,
    });

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Create Item",
        categories: categories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];
