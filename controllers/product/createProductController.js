const { createProduct } = require("../../helpers/product");

module.exports = createProductController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let mustKeys = ["name", "price",];
  let validKeys = ["type","note"];

  try {
    if (keys.length === 0) {
      throw new Error("No data provided");
    }
    keys.forEach((key) => {
      if (!validKeys.includes(key) && !mustKeys.includes(key)) {
        throw Error(`Invalid key: ${key}`);
      }
    });
    mustKeys.forEach((key) => {
      if (!keys.includes(key)) {
        throw Error(`Missing key: ${key}`);
      }
    });

    const product = await createProduct(req.body);
    if (!product) throw Error("Error creating product");
    
    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Product created successfully",
      data: product,
    });

  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
