// const { baseCount } = require("../../globals/constants");
const { listProduct } = require("../../helpers/product");

module.exports = listProductController = async (req, res, next) => {
  try {
    let params = Object.keys(req.query);
    let page = req?.query.page ? parseInt(req?.query.page) : 1;
    let count = req?.query.count ? parseInt(req?.query.count) : 20;
    let offset = (page - 1) * count;
    const validParams = [
      "price_from",
      "price_to",
      "date_from",
      "date_to",
      "name",
      "count",
      "page",
      "note",
      "sort_order",
      "sort_by",
    ];

    params.forEach((param) => {
      if (!validParams.includes(param)) {
        throw Error(`Invalid query param: ${param}`);
      }
    });

    const data = await listProduct({
      offset,
      limit: count,
      currentPage: page,
      ...req.query,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Retrieved products successfully",
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
