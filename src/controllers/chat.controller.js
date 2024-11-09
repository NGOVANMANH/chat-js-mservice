const chatService = require("../services/chat.service");

class ChatController {
  saveMessageSync = async (req, res, next) => {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.receiverId;
      const type = req.query.type;
      const content = req.body.content;
      const attachments = req.files || [];

      if (!senderId || !receiverId || !content) {
        return res.status(400).json({
          message: "Missing data.",
        });
      }

      let message;

      if (type && type === "group") {
        message = await chatService.saveMessageSync({
          type,
          senderId,
          groupId: receiverId,
          content,
          attachments,
        });
      } else {
        message = await chatService.saveMessageSync({
          senderId,
          receiverId,
          content,
          attachments,
        });
      }

      return res.status(201).json({
        message,
      });
    } catch (error) {
      next(error);
    }
  };

  getConversationSync = async (req, res, next) => {
    try {
      const { receiverId } = req.query;

      const senderId = req.user.id;

      if (!senderId || !receiverId)
        return res.status(400).json({
          message: "Missing data.",
        });

      const messages = await chatService.getMessagesSync({
        senderId,
        receiverId,
      });

      return res.status(200).json({
        messages,
      });
    } catch (error) {
      next(error);
    }
  };

  getConversationsSync = async (req, res, next) => {
    try {
      const user = req.user;
      const conversations = await chatService.getConversationsSync(user._id);

      return res.status(200).json({
        conversations,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ChatController();
