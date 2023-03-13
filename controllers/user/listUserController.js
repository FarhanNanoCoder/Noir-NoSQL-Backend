// const { baseCount } = require("../../globals/constants");
const { listUser } = require("../../helpers/user");

module.exports = listUserController = async (req, res, next) => {
  try {
    let params = Object.keys(req.query);
    let page = req?.query.page ? parseInt(req?.query.page) : 1;
    let count = req?.query.count ? parseInt(req?.query.count) : 20;
    let offset = (page - 1) * count;
    const validParams = ["address", "role", "name", "count", "page","phone","sort_order","sort_by"];

    
    params.forEach((param) => {
      if (!validParams.includes(param)) {
        throw Error(`Invalid query param: ${param}`);
      }
    });

    const data = await listUser({
      offset,
      limit: count,
      currentPage: page,
      ...req.query,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Retrieved users successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: "failed",
      message: err.message,
    });
  }
};
