const messageModel = require("../models/message.model");
const groupModel = require("../models/group.model");
const userModel = require("../models/user.model");

class MessageRepo {
  createMessageSync = async ({
    type,
    senderId,
    receiverId,
    groupId,
    content,
    attachmentIds,
  }) => {
    const newMessage = new messageModel({
      type,
      senderId,
      receiverId,
      groupId,
      content,
      attachmentIds,
    });

    if (groupId) {
      const existingGroup = await groupModel.findById(groupId);

      if (!existingGroup) throw new Error("Group is not exist.");
    }

    if (receiverId) {
      const existingUser = await userModel.findById(receiverId);

      if (!existingUser) throw new Error("User is not exist.");
    }

    const savedMessage = await newMessage.save();

    return savedMessage;
  };

  getMessagesSync = async ({ senderId, receiverId }, options = {}) => {
    const { limit = 100, offset = 0 } = options;

    const messages = await messageModel
      .find({ senderId, receiverId })
      .populate("senderId", "username email avatarUrl")
      .populate("receiverId", "username email avatarUrl")
      .populate("groupId", "name avatarUrl")
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);

    return messages;
  };

  getConversationsSync = async (userId) => {
    const conversations = await messageModel.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "group",
        },
      },
      {
        $unwind: {
          path: "$group",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "group.memberIds",
          foreignField: "_id",
          as: "groupMembers",
        },
      },
      {
        $addFields: {
          "group.members": {
            $map: {
              input: "$groupMembers",
              as: "member",
              in: {
                _id: "$$member._id",
                email: "$$member.email",
                username: "$$member.username",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: {
          path: "$receiver",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          senderId: 0,
          groupId: 0,
          receiverId: 0,
          groupMembers: 0,
        },
      },
    ]);

    return conversations;
  };
}

module.exports = new MessageRepo();
