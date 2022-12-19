const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: { type: String, required: true },
});

// Virtual for item's URL
MemberSchema.virtual("url").get(function () {
  return `/members/${this._id}`;
});

// Export model
module.exports = mongoose.model("Member", MemberSchema);
