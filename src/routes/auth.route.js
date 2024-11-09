const authController = require("../controllers/auth.controller");
const AppRoute = require("./route.class");

class ChatRoute extends AppRoute {
  constructor() {
    super();
    this.router.post("/register", authController.registerSync);
    this.router.post("/login", authController.loginSync);
  }
}

module.exports = new ChatRoute();
