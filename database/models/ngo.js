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
  media_urls: [{ type: String, required: true }],
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
});

const NGO = mongoose.model("ngo", ngo);
module.exports = NGO;
