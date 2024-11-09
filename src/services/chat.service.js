const messageRepo = require("../repositories/message.repo");
const attachmentRepo = require("../repositories/attachment.repo");
const cloudinaryService = require("../services/cloudinary.service");

class ChatService {
  saveMessageSync = async ({
    type,
    senderId,
    receiverId,
    groupId,
    content,
    attachments,
  }) => {
    const attachmentIds = [];
    const failedUploads = []; // Track failed uploads

    if (attachments) {
      for (const attachment of attachments) {
        try {
          // Attempt to upload the file
          const uploadResult = await cloudinaryService.uploadFileSync(
            attachment.path,
            {
              resource_type: attachment.mimetype.split("/")[0],
            }
          );

          if (uploadResult.success) {
            // If successful, save attachment info
            const newAttachment = await attachmentRepo.createAttachmentSync({
              url: uploadResult.url,
              type: uploadResult.type,
              metadata: {
                size: attachment.size,
                format: attachment.mimetype,
              },
            });
            attachmentIds.push(newAttachment._id);
          } else {
            // If upload fails, add to failedUploads and continue
            failedUploads.push(attachment.originalname);
            console.error(
              `Attachment upload failed for ${attachment.originalname}: ${uploadResult.message}`
            );
          }
        } catch (error) {
          // Catch other errors and add to failedUploads
          failedUploads.push(attachment.originalname);
          console.error("Error handling attachment:", error);
        }
      }
    }

    // If there were failed uploads, respond with an error
    if (failedUploads.length > 0) {
      throw new Error(
        `Failed to upload the following files: ${failedUploads.join(
          ", "
        )}. Please try re-uploading.`
      );
    }

    const newMessage = await messageRepo.createMessageSync({
      type,
      senderId,
      receiverId,
      groupId,
      content,
      attachmentIds,
    });
    return newMessage;
  };

  getMessagesSync = async ({ senderId, receiverId }, options = {}) => {
    const messages = await messageRepo.getMessagesSync(
      { senderId, receiverId },
      options
    );
    return messages;
  };

  getConversationsSync = async (userId) => {
    const conversations = await messageRepo.getConversationsSync(userId);
    return conversations;
  };
}

module.exports = new ChatService();
