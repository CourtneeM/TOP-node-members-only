const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true},
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Member", required: true },
});

// Virtual for item's URL
MessageSchema.virtual("url").get(function () {
  return `${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
