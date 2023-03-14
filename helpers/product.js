const Product = require("../models/product");
const { generateDateQuery, generateRangeQuery } = require("./utils");

module.exports = {
  createProduct: async (body) => {
    try {
      const product = new Product(body).save();
      return product;
    } catch (error) {
      console.log(error.message);
      //   throw error;
      return null;
    }
  },
  updateProduct: async ({ _id }, body) => {
    try {
      let product = await Product.findById(_id);
      if (product) {
        await Product.updateOne({ _id: _id }, body, {
          new: true,
          runValidators: true,
        });
        return {
          ...product?._doc,
          ...body,
        };
      } else {
        throw Error("Product not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  listProduct: async (params) => {
    try {
      let filter = {
        $match: {},
      };
      let orArray = [];

      //direct matchers
      if (params?.price) {
        filter.$match["price"] = parseFloat(params?.price);
      }
      if (params?.price_from || params?.price_to) {
        filter.$match["price"] = generateRangeQuery(
          parseFloat(params?.price_from),
          parseFloat(params?.price_to)
        );
      }
      if (params?.date_from || params?.date_to) {
        filter.$match["createdAt"] = generateDateQuery(
          params?.date_from,
          params?.date_to
        );
      }

      //or matchers
      ["name", "type", "note"].forEach((key) => {
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
      const total = await Product.countDocuments(filter.$match);

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

      let docs = await Product.aggregate(aggregate);
      if (docs.length === 0) {
        throw Error("No products found");
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
  delProduct: async (_id) => {
    try {
      let product = await Product.findById(_id);
      if (product) {
        await product.deleteOne();
        return true;
      } else {
        throw Error("Product not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  getProduct: async (_id) => {
    try {
      console.log("deleting ", _id);
      let product = await Product.findById(_id);
      if (product) {
        return product;
      } else {
        throw Error("Product not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
};
