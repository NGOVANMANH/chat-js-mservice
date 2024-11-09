const attachmentController = require("../controllers/attachment.controller");
const AppRoute = require("./route.class");
const { upload } = require("../middlewares/multer-custom.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

class AttachmentRoute extends AppRoute {
  constructor() {
    super();
    this.router.post(
      "/upload",
      authMiddleware.authenticate,
      upload.array("attachments", 10),
      attachmentController.uploadFilesSync
    );
    this.router.get(
      "/:id",
      authMiddleware.authenticate,
      attachmentController.getAttachmentByIdSync
    );
  }
}

module.exports = new AttachmentRoute();
