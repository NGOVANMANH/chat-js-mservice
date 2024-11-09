const userRepo = require("../repositories/user.repo");

class UserService {
  findUserByIdSync = async (id) => {
    return await userRepo.findUserByIdSync(id);
  };
}

module.exports = new UserService();
