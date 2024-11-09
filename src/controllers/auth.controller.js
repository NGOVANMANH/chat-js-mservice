const authService = require("../services/auth.service");
const jwtService = require("../services/jwt.service");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

class AuthController {
  registerSync = async (req, res, next) => {
    try {
      const { email, username, password, avatarUrl } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({
          message: "Email, username, password is required.",
        });
      }

      if (!validateEmail(email.trim())) {
        return res.status(400).json({
          message: "Email invalid.",
        });
      }

      if (password.trim().length < 8) {
        return res.status(400).json({
          message: "Password is >= 8 characters.",
        });
      }

      const newAccount = await authService.registerSync({
        email,
        username,
        password,
        avatarUrl,
      });

      newAccount.password = undefined;

      return res.status(201).json({
        user: newAccount,
      });
    } catch (error) {
      next(error);
    }
  };

  loginSync = async (req, res, next) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          message: "Identifier, password is required.",
        });
      }

      const user = await authService.loginSync({
        identifier,
        password,
      });

      user.password = undefined;

      const token = jwtService.createToken({ id: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });

      return res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
