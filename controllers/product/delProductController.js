const { delProduct } = require("../../helpers/product");

module.exports = delProductController = async (req, res, next) => {
  try {
    await delProduct(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
