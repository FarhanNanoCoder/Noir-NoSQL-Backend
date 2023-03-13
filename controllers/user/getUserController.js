const { getUser } = require("../../helpers/user");

module.exports = getUserController = async (req, res, next) => {
  try {
    const user = await getUser(req.params?._id ?? "");

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Retrieved user successfully",
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
