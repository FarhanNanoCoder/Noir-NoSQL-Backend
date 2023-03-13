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
  delUser: async (_id) => {
    try {
      console.log("deleting ", _id);
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
