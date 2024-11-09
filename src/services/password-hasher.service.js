const bcrypt = require("bcrypt");

const passwordHasher = {
  saltRounds: 10,

  hashPasswordSync: async (password) => {
    const salt = await bcrypt.genSaltSync(this.saltRounds);
    return await bcrypt.hashSync(password, salt);
  },

  comparePasswordSync: async (password, hashedPassword) => {
    return await bcrypt.compareSync(password, hashedPassword);
  },
};

module.exports = passwordHasher;
