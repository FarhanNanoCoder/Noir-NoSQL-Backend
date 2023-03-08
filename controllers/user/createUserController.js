const { createUser } = require("../../helpers/user");

module.exports = createUserController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let mustKeys = ["name", "role", "phone"];
  let validKeys = ["email", "address"];

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

    const user = await createUser(req.body);
    if (!user) throw Error("Error creating user");
    
    return res.status(201).json({
      code: 201,
      status: "created",
      message: "User created successfully",
      data: user,
    });

  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
