const attachmentRepo = require("../repositories/attachment.repo");

class AttachmentService {
  saveAttachmentSync = async (attachment) => {
    console.log(attachment);
    const [type, format] = attachment.mimetype.split("/");

    return await attachmentRepo.createAttachmentSync({
      url: attachment.path,
      metadata: {
        size: attachment.size,
        format,
      },
      type,
    });
  };

  getAttachmentByIdSync = async (id) => {
    return await attachmentRepo.getAttachmentByIdSync(id);
  };
}

module.exports = new AttachmentService();
