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
};
