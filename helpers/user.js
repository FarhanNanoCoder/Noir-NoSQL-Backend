const User = require("../models/user");

module.exports = {
  createUser: async (body) => {
    try {
      const user = new User(body).save();
      return user;
    } catch (error) {
      console.log(error.message);
      //   throw error;
      return null;
    }
  },
  updateUser: async ({ _id }, body) => {
    try {
      let user = await User.findById(_id);
      if (user) {
        await User.updateOne({ _id: _id }, body, {
          new: true,
          runValidators: true,
        });
        return {
          ...user?._doc,
          ...body,
        };
      } else {
        throw Error("User not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  listUser: async (params) => {
    try {
      let filter = {
        $match: {},
      };
      let orArray = [];

      //direct matchers
      if (params?.role){
        filter.$match["role"] = parseInt(params?.role);
      }
      if (params?.createdAt) {
        filter.$match["createdAt"] = parseInt(params?.createdAt);
      }

      //or matchers
      ["name", "email", "phone"].forEach((key) => {
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
      const total = await User.countDocuments(filter.$match);

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
              previous: { $cond: [params?.currentPage === 1, null, params?.currentPage - 1] },
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

      let docs = await User.aggregate(aggregate);
      if (docs.length === 0) {
        throw Error("No users found");
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
  delUser: async (_id) => {
    try {
      let user = await User.findById(_id);
      if (user) {
        await user.deleteOne();
        return true;
      } else {
        throw Error("User not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
  getUser: async (_id) => {
    try {
      console.log("deleting ", _id);
      let user = await User.findById(_id);
      if (user) {
        return user;
      } else {
        throw Error("User not found");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
      // return null;
    }
  },
};
