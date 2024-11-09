const UserModel = require("../models/user.model");

const userRepo = {
  createUserSync: async ({ email, username, password, avatarUrl }) => {
    const newUser = new UserModel({
      email,
      username,
      password,
      avatarUrl,
    });

    const savedUser = await newUser.save();

    return savedUser;
  },

  findUserByIdSync: async (userId) => {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      const userNotFoundError = new Error("User not exist.");
      userNotFoundError.statusCode = 404;
      throw userNotFoundError;
    }

    return foundUser;
  },

  identifyUserSync: async ({ identifier, password }) => {
    const foundUser = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!foundUser) {
      throw new Error("In valid credentials.");
    }

    const isPasswordMatch = await foundUser.comparePassword(password);

    if (!isPasswordMatch) {
      throw new Error("In valid credentials.");
    }

    return foundUser;
  },
};

module.exports = userRepo;
