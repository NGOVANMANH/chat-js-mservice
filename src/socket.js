const chatService = require("./services/chat.service");

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.use(require("./middlewares/auth.middleware").socketAuthenticate);

  io.on("connection", async (socket) => {
    // Get user from socket authentication middleware
    const user = socket.user;
    const userSocketId = socket.id;

    console.log(`user: '${user._id}' connected. with id: ${userSocketId}`);

    // Add user to online users
    onlineUsers.set(user._id.toString(), userSocketId);

    // Emit online users to all clients
    io.emit("user_online", Array.from(onlineUsers.keys()));

    // Get messages
    try {
      const conversations = await chatService.getConversationsSync(user._id);

      io.to(userSocketId).emit("get_messages", { conversations });
    } catch (error) {
      console.error(error);
      io.to(userSocketId).emit("get_messages_error", {
        error: "Failed get message.",
      });
    }

    // Listen for disconnect event
    socket.on("disconnect", () => {
      console.log(`user: '${user}' disconnected.`);

      onlineUsers.delete(user._id);

      // Emit online users to all clients05:02 PM05:02 PM
      io.emit("user_online", Array.from(onlineUsers.keys()));
    });

    // Listen for send_message event
    socket.on(
      "send_message",
      async ({ type, receiverIds, groupIds, content, attachments }) => {
        console.log(`user: '${user._id}' sent message to: ${receiverIds}`);
        console.log("user-online", onlineUsers);

        if (!type) {
          io.to(userSocketId).emit("send_message_error", {
            error: "Message type is required.",
          });
          return;
        }

        if (type === "user" && receiverIds) {
          receiverIds.forEach(async (receiverId) => {
            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
              try {
                const savedMessage = await chatService.saveMessageSync({
                  senderId: user._id,
                  receiverId,
                  content,
                  attachmentIds: null,
                });

                io.to(receiverSocketId).emit("receive_message", {
                  message: savedMessage,
                });
              } catch (error) {
                io.to(userSocketId).emit("receive_message_error", {
                  receiverId,
                  error: "Failed to send message.",
                });
              }
            }
          });
        } else if (type === "group" && groupIds) {
        }
      }
    );
  });

  io.on("error", (error) => {
    console.error("Socket encountered error:", error);
  });
};

module.exports = socketHandler;
