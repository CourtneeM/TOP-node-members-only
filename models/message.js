const mongoose = require("mongoose");
const dateFormat = require('dateformat');

const Schema = mongoose.Schema;

const createdAt = () => dateFormat(new Date(), "ddd, mmm dd yyyy h:MM:ss TT UTC");

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  timestamp: { type: String, default: createdAt, required: true},
});

// Virtual for item's URL
MessageSchema.virtual("url").get(function () {
  return `${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
