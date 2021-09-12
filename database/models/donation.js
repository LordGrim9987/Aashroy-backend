var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var donation = new Schema({
  donor: {
    type: Schema.Types.ObjectId,
    ref: "general_users",
  },
  donor_name: {
    type: String,
  },
  contact_number: {
    type: Number,
  },
  ngo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ngo",
  },
  type: {
    type: String,
    required: true,
  },
  media_url: {
    type: String,
    required: true,
  },
  dimensions: [{ type: Number, required: true }],
  weight: {
    type: Number,
    required: true,
  },
  time_stamp: {
    type: String,
    required: true,
  },
});

const DONATION = mongoose.model("donation", donation);
module.exports = DONATION;
