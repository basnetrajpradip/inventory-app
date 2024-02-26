console.log(
  'This script populates some test items, categories to your database which is specified as argument - e.g.: "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_app?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description, imageUrl) {
  const category = new Category({ name: name, description: description, imageUrl: imageUrl });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate({ index, name, description, category, price, stock, imageUrl }) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock,
    imageUrl: imageUrl,
  };

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "Welcome to the electronics paradise, where innovation meets functionality. Dive into our extensive range of cutting-edge gadgets and devices designed to enhance your lifestyle. From smartphones and laptops to home entertainment systems and smart appliances, we have everything you need to stay connected and entertained. Explore our selection of top brands and the latest tech trends, and let us bring convenience and excitement to your fingertips.",
      "/images/electronics-default.jpg"
    ),
    categoryCreate(
      1,
      "Clothing",
      "Elevate your wardrobe with our curated collection of stylish apparel. From timeless classics to the latest fashion trends, we offer a diverse range of clothing options for every occasion. Explore our selection of tops, bottoms, dresses, and outerwear, meticulously designed to enhance your personal style and make a statement wherever you go. Shop now and discover the perfect pieces to express your individuality",
      "/images/clothing-default.jpg"
    ),
    categoryCreate(
      2,
      "Furniture",
      "Transform your living space into a haven of comfort and style with our exquisite collection of furniture. Discover a world of elegance and functionality as you explore our curated selection of sofas, chairs, tables, and storage solutions. Crafted from the finest materials and designed with impeccable attention to detail, our furniture pieces seamlessly blend aesthetics with practicality. Whether you're revamping your home office or upgrading your living room, we have the perfect pieces to elevate your decor and create a space you'll love coming home to.",
      "/images/furniture-default.jpg"
    ),
    categoryCreate(
      3,
      "Groceries",
      "Indulge in the freshest flavors and finest ingredients with our extensive selection of groceries. From pantry staples to gourmet treats, we offer a diverse range of products to satisfy every craving and culinary need. Explore our aisles filled with organic produce, artisanal snacks, and international delicacies, carefully curated to elevate your cooking and dining experience. With quality and convenience at the forefront, we're your one-stop destination for all your grocery essentials. Shop now and bring home the taste of excellence.",
      "/images/groceries-default.jpg"
    ),
    categoryCreate(
      4,
      "Sports and Outdoor",
      "Embrace your adventurous spirit with our exciting range of sports and outdoor gear. Whether you're a seasoned athlete or a weekend warrior, we have everything you need to fuel your passion for the great outdoors. Explore our collection of high-performance equipment, stylish activewear, and essential accessories designed to enhance your fitness routine and outdoor adventures. From hiking and camping to team sports and fitness training, we're here to support your active lifestyle. Gear up and get ready to conquer new challenges with confidence and style.",
      "/images/sport&outdoors-default.jpg"
    ),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate({
      index: 0,
      name: "Stellar X10",
      description:
        "Stay connected and productive with the Stellar X10 smartphone. Featuring a vibrant display, powerful processor, and advanced camera system, this sleek device lets you do more on the go. With its sleek design and intuitive interface, the Stellar X10 is your perfect companion for work and play.",
      category: categories[0],
      price: 699,
      stock: 9,
      imageUrl: "/images/electronics2-default.jpg",
    }),
    itemCreate({
      index: 1,
      name: "QuantumBook Pro",
      description:
        "Experience unparalleled performance with the QuantumBook Pro laptop. Equipped with cutting-edge technology and a stunning display, this powerhouse device is designed to handle your most demanding tasks with ease. Whether you're multitasking for work or immersing yourself in entertainment, the QuantumBook Pro delivers exceptional speed and efficiency.",
      category: categories[0],
      price: 1399,
      stock: 4,
      imageUrl: "/images/electronics1-default.jpg",
    }),
    itemCreate({
      index: 2,
      name: "Classic Denim Jacket - UrbanEdge",
      description:
        "Elevate your casual look with the UrbanEdge denim jacket. Crafted from premium denim fabric and featuring timeless design elements, this versatile piece adds effortless style to any outfit. Whether you're layering up for a cool evening or adding a touch of edge to your weekend ensemble, the UrbanEdge jacket is a wardrobe essential.",
      category: categories[1],
      price: 69,
      stock: 18,
      imageUrl: "/images/clothes1-default.jpg",
    }),
    itemCreate({
      index: 3,
      name: "Tailored Slim-Fit Shirt - Executive Elegance",
      description:
        "Make a sophisticated statement with the Executive Elegance tailored shirt. Cut to perfection with a slim fit silhouette and crafted from high-quality cotton, this shirt exudes refined elegance and impeccable style. Whether you're dressing for the boardroom or a formal event, the Executive Elegance shirt ensures you look polished and professional.",
      category: categories[1],
      price: 20,
      stock: 2,
      imageUrl: "/images/clothes2-default.jpg",
    }),
    itemCreate({
      index: 4,
      name: "Modern Sectional Sofa - UrbanComfort",
      description:
        "Transform your living space with the UrbanComfort sectional sofa. Crafted with luxurious upholstery and sleek design elements, this modern sofa offers both style and comfort. Whether you're entertaining guests or lounging with loved ones, the UrbanComfort sofa provides ample seating and contemporary flair to elevate your home decor.",
      category: categories[2],
      price: 239,
      stock: 5,
      imageUrl: "/images/furniture2-default.jpg",
    }),
    itemCreate({
      index: 5,
      name: "Elegant Dining Table Set - RoyalDine",
      description:
        "Dine in style with the RoyalDine dining table set. Featuring a beautifully crafted table and matching chairs, this elegant set adds a touch of sophistication to any dining room. Whether you're hosting formal dinner parties or casual family meals, the RoyalDine set creates a welcoming atmosphere for memorable gatherings and lasting conversations.",
      category: categories[2],
      price: 2344,
      stock: 1,
      imageUrl: "/images/furniture1-default.jpg",
    }),
    itemCreate({
      index: 6,
      name: "Artisanal Olive Oil - Mediterranean Gold",
      description:
        "Elevate your culinary creations with Mediterranean Gold artisanal olive oil. Cold-pressed from the finest olives and infused with rich flavor, this premium oil adds depth and complexity to your dishes. Whether you're drizzling it over salads, dipping bread, or sautéing vegetables, Mediterranean Gold olive oil brings the taste of the Mediterranean to your kitchen.",
      category: categories[3],
      price: 36,
      stock: 32,
      imageUrl: "/images/groceries1-default.jpg",
    }),
    itemCreate({
      index: 7,
      name: "Gourmet Coffee Beans - RoastMaster's Reserve",
      description:
        "Start your day on a delicious note with RoastMaster's Reserve gourmet coffee beans. Sourced from the world's finest coffee-growing regions and expertly roasted to perfection, these premium beans deliver a rich and satisfying brew with every cup. Whether you prefer a bold espresso or a smooth latte, RoastMaster's Reserve coffee beans offer unparalleled quality and flavor.",
      category: categories[3],
      price: 23,
      stock: 12,
      imageUrl: "/images/groceries2-default.jpg",
    }),
    itemCreate({
      index: 8,
      name: "Durable Camping Tent - AdventureSeeker",
      description:
        "Embark on outdoor adventures with the AdventureSeeker camping tent. Constructed from durable materials and featuring weather-resistant design, this spacious tent provides reliable shelter in any environment. Whether you're camping in the mountains or exploring the wilderness, the AdventureSeeker tent offers comfort and protection for unforgettable outdoor experiences.",
      category: categories[4],
      price: 89,
      stock: 4,
      imageUrl: "/images/sports1-default.jpg",
    }),
    itemCreate({
      index: 9,
      name: "High-Performance Hiking Backpack - TrailBlazer Pro",
      description:
        "Conquer the trails with the TrailBlazer Pro hiking backpack. Designed for durability and comfort, this rugged backpack features ample storage space and ergonomic straps for carrying essentials on long treks. Whether you're hiking through rugged terrain or exploring scenic trails, the TrailBlazer Pro backpack ensures you're prepared for every outdoor adventure.",
      category: categories[4],
      price: 169,
      stock: 19,
      imageUrl: "/images/sports2-default.jpg",
    }),
  ]);
}
