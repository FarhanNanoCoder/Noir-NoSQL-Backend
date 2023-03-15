const { updateOrder } = require("../../helpers/order");

module.exports = updateOrderController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let validKeys = ["quantity","amount","note","status","customer","product"];

  try {
    if (keys.length === 0) {
      throw new Error("No data provided");
    }
    keys.forEach((key) => {
      if (!validKeys.includes(key)) {
        throw Error(`Invalid key: ${key}`);
      }
    });

    const order = await updateOrder({_id:req.params?._id},req.body);
    if (!order) throw Error("Error updating order");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Order updated successfully",
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
