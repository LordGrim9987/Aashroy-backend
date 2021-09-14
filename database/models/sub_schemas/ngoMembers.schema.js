var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ngoMembersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
  },
  profile_pic: {
    type: String,
  },
  about: {
    type: String,
  },
});

module.exports = ngoMembersSchema;
