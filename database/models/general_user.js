var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var general_user = new Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: (e) => {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(e);
        },
      },
    },
    name: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    contribution_points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const GENERAL_USER = mongoose.model("general_user", general_user);
module.exports = GENERAL_USER;
