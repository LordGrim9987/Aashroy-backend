var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var general_user = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
  },
  contribution_points: {
    type: Schema.Types.Mixed,
  },
  reported_homeless: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "homeless",
    },
  ],
});

const GENERAL_USER = mongoose.model("general_user", general_user);
module.exports = GENERAL_USER;
