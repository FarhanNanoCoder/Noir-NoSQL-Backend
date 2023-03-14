const { getProduct } = require("../../helpers/product");

module.exports = getProductController = async (req, res, next) => {
  try {
    const product = await getProduct(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Retrieved product successfully",
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
