const { updateProduct } = require("../../helpers/product");

module.exports = updateProductController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let validKeys = ["name","note","price","type"];

  try {
    if (keys.length === 0) {
      throw new Error("No data provided");
    }
    keys.forEach((key) => {
      if (!validKeys.includes(key)) {
        throw Error(`Invalid key: ${key}`);
      }
    });

    const product = await updateProduct({_id:req.params?._id},req.body);
    if (!product) throw Error("Error updating product");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Product updated successfully",
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
