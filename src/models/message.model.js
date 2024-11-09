const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["user", "group"],
      default: "user",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "user";
      },
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: function () {
        return this.type === "group";
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model("Message", messageSchema);
