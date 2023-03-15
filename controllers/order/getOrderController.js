const { getOrder } = require("../../helpers/order");

module.exports = getOrderController = async (req, res, next) => {
  try {
    const order = await getOrder(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Retrieved order successfully",
      data: order,
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
