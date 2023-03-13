const { delUser } = require("../../helpers/user");

module.exports = delUserController = async (req, res, next) => {
  try {
    await delUser(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "Bad Request",
      message: err.message,
    });
  }
};
