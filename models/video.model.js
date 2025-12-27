const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    // used in UI
    title: {
      type: String,
      required: true,
      trim: true
    },

    // filename stored in a disk
    filename: {
      type: String,
      required: true
    },

    // status of the video
    status: {
      type: String,
      enum: ["processing", "safe", "flagged"],
      default: "processing"
    },

    // reference to the user
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // unique id in a multi tenant System.
    tenantId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = {Video}
