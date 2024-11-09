const jwt = require("jsonwebtoken");

const jwtService = {
  secret: process.env.JWT_SECRET,

  createToken: (payload, expiresIn = "1h") => {
    try {
      const token = jwt.sign(payload, jwtService.secret, { expiresIn });
      return token;
    } catch (error) {
      console.error("Error creating token:", error);
      throw new Error("Token creation failed");
    }
  },

  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, jwtService.secret);
      return decoded;
    } catch (error) {
      console.error("Error verifying token:", error);
      throw new Error("Token verification failed");
    }
  },
};

module.exports = jwtService;
