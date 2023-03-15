const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const { generateDateQuery, generateRangeQuery } = require("./utils");

module.exports = {
  createOrder: async (body) => {
    try {
      const customer = await User.findById(body?.customer);
      if (!customer) throw Error("Customer not found");

      const product = await Product.findById(body?.product);
      if (!product) throw Error("Product not found");

      const order = new Order(body).save();
      return order;
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  updateOrder: async ({ _id }, body) => {
    try {
      let order = await Order.findById(_id);
      const customer = await User.findById(body?.customer || order?.customer);
      if (!customer) throw Error("Customer not found");

      const product = await Product.findById(body?.product || order?.product);
      if (!product) throw Error("Product not found");

      if (order) {
        await Order.updateOne({ _id: _id }, body, {
          new: true,
          runValidators: true,
        });
        return {
          ...order?._doc,
          ...body,
        };
      } else {
        throw Error("Order not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  listOrder: async (params) => {
    try {
      let filter = {
        $match: {},
      };
      let orArray = [];

      //direct matchers
      if (params?.customer) {
        filter.$match["customer"] = params?.customer;
      }
      if (params?.product) {
        filter.$match["product"] = params?.product;
      }
      if (params?.amount_from || params?.amount_to) {
        filter.$match["amount"] = generateRangeQuery(
          parseFloat(params?.amount_from),
          parseFloat(params?.amount_to)
        );
      }
      if (params?.quantity_from || params?.quantity_to) {
        filter.$match["quantity"] = generateRangeQuery(
          parseInt(params?.quantity_from),
          parseInt(params?.quantity_to)
        );
      }
      if (params?.date_from || params?.date_to) {
        filter.$match["createdAt"] = generateDateQuery(
          params?.date_from,
          params?.date_to
        );
      }

      //or matchers
      ["note"].forEach((key) => {
        if (params[key]) {
          orArray.push({
            [key]: {
              $regex: params[key],
              $options: "i",
            },
          });
        }
      });

      if (orArray.length !== 0) {
        filter.$match["$or"] = orArray;
      }

      const sortOrder =
        params?.sort_order && params?.sort_order === "asc" ? 1 : -1;
      const sortBy = params?.sort_by || "createdAt";
      const total = await Order.countDocuments(filter.$match);

      let aggregate = [
        filter,
        {
          $sort: {
            [sortBy]: sortOrder,
            _id: -1,
          },
        },
        { $skip: params?.offset },
        { $limit: params?.limit },
        {
          $project: {
            password: 0,
            __v: 0,
          },
        },
        {
          $group: {
            _id: null,
            results: { $push: "$$ROOT" },
          },
        },
        {
          $addFields: { total },
        },
        {
          $project: {
            _id: 0,
            meta: {
              previous: {
                $cond: [
                  params?.currentPage === 1,
                  null,
                  params?.currentPage - 1,
                ],
              },
              next: {
                $cond: {
                  if: { $lte: ["$total", params?.offset + params?.limit] },
                  then: null,
                  else: params?.currentPage + 1,
                },
              },
              total: "$total",
              page_size: { $size: "$results" },
              last_page: { $ceil: { $divide: ["$total", params?.limit] } },
            },
            results: 1,
          },
        },
      ];

      let docs = await Order.aggregate(aggregate);
      if (docs.length === 0) {
        throw Error("No orders found");
      }
      return docs[0];
    } catch (error) {
      console.log(error.message);
      return {
        meta: {
          previous: null,
          next: null,
          total: 0,
          page_size: 1,
          last_page: 1,
        },
        results: [],
      };
    }
  },
  delOrder: async (_id) => {
    try {
      let order = await Order.findById(_id);
      if (order) {
        await order.deleteOne();
        return true;
      } else {
        throw Error("Order not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  getOrder: async (_id) => {
    try {
      console.log("deleting ", _id);
      let order = await Order.findById(_id);
      if (order) {
        return order;
      } else {
        throw Error("Order not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
};
