const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "audio", "file", "text", "application"],
      required: true,
    },
    metadata: {
      size: Number,
      format: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attachment", attachmentSchema);
