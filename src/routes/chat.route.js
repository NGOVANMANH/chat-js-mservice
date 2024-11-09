const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const AppRoute = require("./route.class");

const { upload } = require("../middlewares/multer-custom.middleware");

class ChatRoute extends AppRoute {
  constructor() {
    super();
    this.router.post(
      "/:receiverId",
      authMiddleware.authenticate,
      upload.array("attachments"),
      chatController.saveMessageSync
    );
    this.router.get(
      "/",
      authMiddleware.authenticate,
      chatController.getConversationSync
    );
    this.router.get(
      "/conversations",
      authMiddleware.authenticate,
      chatController.getConversationsSync
    );
  }
}

module.exports = new ChatRoute();
