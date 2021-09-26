const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort("name")
    .select("-name")
    .limit(10);
  res.status(200).json({ products, numHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    // Finds name by case insensitive
    queryObject.name = { $regex: name, $options: "i" };
  }

  // console.log(queryObject)

  let result = Product.find(queryObject);

  // Sort functionality
  if (sort) {
    //  Splits query params by , and joins them back with spaces.
    const sortedList = sort.split(",").join(" ");

    // Returns query params with spaces to result.
    result = result.sort(sortedList);
  } else {
    result = result.sort("-createdAt");
  }

  if (fields) {
    //  Splits query params by , and joins them back with spaces.
    const fieldsList = fields.split(",").join(" ");

    // Returns query params with spaces to result.
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page-1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result;
  res.status(200).json({ products, numHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
