const userRepo = require("../repositories/user.repo");

const authService = {
  registerSync: async ({ email, username, password, avatarUrl }) => {
    return await userRepo.createUserSync({
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
      avatarUrl: avatarUrl?.trim(),
    });
  },

  loginSync: async ({ identifier, password }) => {
    return await userRepo.identifyUserSync({ identifier, password });
  },
};

module.exports = authService;
