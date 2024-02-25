const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([Category.countDocuments({}).exec(), Item.countDocuments({}).exec()]);

  res.render("index", {
    category_count: numCategories,
    item_count: numItems,
  });
});

//Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name category").populate("category").sort({ name: 1 }).exec();
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

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
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
exports.item_delete_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

//Handle item delete on POST.
exports.item_delete_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

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

//Handle item create on POST.
exports.item_update_post = [
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

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
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
