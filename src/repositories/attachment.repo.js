const attachmentModel = require("../models/attachment.model");

class AttachmentRepo {
  createAttachmentSync = async ({ url, type, metadata }) => {
    const newAttachment = new attachmentModel({
      url,
      type,
      metadata,
    });
    await newAttachment.save();
    return newAttachment;
  };

  getAttachmentByIdSync = async (id) => {
    const attachment = await attachmentModel.findById(id);
    if (!attachment) {
      const error = new Error("Attachment not found");
      error.statusCode = 404;
      throw error;
    }
    return attachment;
  };
}

module.exports = new AttachmentRepo();
