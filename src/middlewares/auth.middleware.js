const jwtService = require("../services/jwt.service");
const userModel = require("../models/user.model");
// const cookieParser = require("cookie-parser");

const authMiddleware = {
  authenticate: async (req, res, next) => {
    try {
      // const authHeader = req.headers.authorization;

      // if (!authHeader) {
      //   return res
      //     .status(401)
      //     .json({ message: "Authorization header is missing." });
      // }

      // const token = authHeader.split(" ")[1];

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Token is missing." });
      }

      const decodedToken = await jwtService.verifyToken(token);

      if (!decodedToken) {
        return res.status(401).json({ message: "Token is invalid." });
      }

      const { id } = decodedToken;

      const user = await userModel.findById(id);

      if (!user) {
        return res.status(401).json({ message: "Token is invalid." });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Authentication failed.", error: error.message });
    }
  },
  socketAuthenticate: async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query.token;

      // const cookies = socket.handshake.headers.cookie;
      // let token;

      // Cookies = cookieParser.parse(cookies);
      //   token = parif (cookies) {
      //   const parsedsedCookies.token;
      // }

      if (!token) {
        return next(new Error("Authentication token is missing."));
      }

      const decodedToken = await jwtService.verifyToken(token);
      if (!decodedToken) {
        return next(new Error("Invalid token."));
      }

      const user = await userModel.findById(decodedToken.id);
      if (!user) {
        return next(new Error("User not found."));
      }

      user.password = undefined;

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed."));
    }
  },
};

module.exports = authMiddleware;
