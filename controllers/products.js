const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort("name")
    .select("-name")
    .limit(10);
  res.status(200).json({ products, numHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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

  // Math operators sent by URL params
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<=": "$lte",
      "<": "$lt",
    };

    // regex matches any operator
    const regEx = /\b(<|<=|=|>=|>)\b/g;

    // Replaces every operator with Mongoose operator.
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];

    // Destructure query into 3 variables. -> price, $gt, 50
    filters = filters.split(",").map((item) => {
      const [field, operator, value] = item.split("-");

      if (options.includes(field)) {
        // Appends a query object to QueryObject
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);

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
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, numHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
