var mongoose = require("mongoose");
const locationSchema = require("./sub_schemas/location.schema");
const ngoMembersSchema = require("./sub_schemas/ngoMembers.schema");
var Schema = mongoose.Schema;

var ngo = new Schema({
  received_donations: [
    {
      type: Schema.Types.ObjectId,
      ref: "donation",
    },
  ],
  ngo_work_details: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ngo_work_detail",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  geo_location: {
    type: locationSchema,
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
  members: [{ type: ngoMembersSchema }],
  about: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (e) => {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(e);
      },
    },
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: (n) => {
        return /d{10}/.test(n);
      },
    },
  },
  website: {
    type: String,
    validate: {
      validator: (url) => {
        var res = url.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        if (res == null) return false;
        return true;
      },
    },
  },
  is_not_receiving_donations: {
    type: Boolean,
    default: true,
  },
  is_inactive: {
    type: Boolean,
    default: false,
  },
});

const NGO = mongoose.model("ngo", ngo);
module.exports = NGO;
