const AppRoute = require("./route.class");

const chatRoute = require("./chat.route");
const authRoute = require("./auth.route");
const attachmentRoute = require("./attachment.route");
const groupRoute = require("./group.route");

class Routes extends AppRoute {
  constructor() {
    super();
    this.initRoute();
  }

  initRoute() {
    this.router.use("/chats", chatRoute.router);
    this.router.use("/auth", authRoute.router);
    this.router.use("/attachments", attachmentRoute.router);
    this.router.use("/groups", groupRoute.router);
  }
}

module.exports = new Routes().router;
