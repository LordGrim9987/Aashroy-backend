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
    dimensions: [{ type: String, required: true }], // length, width, height
    weight: {
      type: String,
      required: true,
    },
    received_time_stamp: {
      type: Date,
    },
  },
  { timestamps: true }
);

const DONATION = mongoose.model("donation", donation);
module.exports = DONATION;
