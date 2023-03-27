const { updateUser } = require("../../helpers/user");

module.exports = updateUserController = async (req, res, next) => {
  let keys = Object.keys(req.body);
  let validKeys = ["address", "role", "name", "avatar"];

  try {
    if (keys.length === 0) {
      throw new Error("No data provided");
    }
    keys.forEach((key) => {
      if (!validKeys.includes(key)) {
        throw Error(`Invalid key: ${key}`);
      }
    });

    const user = await updateUser({ _id: req.params?._id }, req.body);
    if (!user) throw Error("Error updating user");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "User updated successfully",
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
