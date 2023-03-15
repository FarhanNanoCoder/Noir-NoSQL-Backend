const { createOrder } = require("../../helpers/order");

module.exports = createOrderController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let mustKeys = ["customer","product","quantity","amount"];
  let validKeys = ["note","status"];

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

    const order = await createOrder(req.body);
    if (!order) throw Error("Error creating order");
    
    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Order created successfully",
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
