var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var session = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
});

const SESSIONS = mongoose.model("session", session);
module.exports = SESSIONS;
