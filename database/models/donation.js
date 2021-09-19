var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var donation = new Schema(
  {
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
    is_accepted_by_ngo: {
      type: Boolean,
      default: false,
    },
    is_donation_received: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    media_urls: [
      {
        url: {
          type: String,
        },
        media_type: {
          type: String,
        },
      },
    ],
    dimensions: [{ type: Number, required: true }],
    weight: {
      type: Number,
      required: true,
    },
    time_stamp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DONATION = mongoose.model("donation", donation);
module.exports = DONATION;
