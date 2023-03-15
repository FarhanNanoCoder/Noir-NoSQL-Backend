const { delOrder } = require("../../helpers/order");

module.exports = delOrderController = async (req, res, next) => {
  try {
    await delOrder(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
