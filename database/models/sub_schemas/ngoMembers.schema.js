var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ngoMembersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  joined_at: {
    type: String,
  },
  profile_pic: {
    type: String,
  },
  about: {
    type: String,
  },
});

module.exports = ngoMembersSchema;
