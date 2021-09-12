var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ngo = new Schema({
  received_donations: [{ type: Schema.Types.ObjectId, ref: "donation" }],
  ngo_work_details: [
    { type: Schema.Types.ObjectId, required: true, ref: "ngo_work_detail" },
  ],
  name: {
    type: String,
    required: true,
  },
  geo_location: {
    type: String,
    required: true,
  },
  media_urls: [{ type: String, required: true }],
  members: [{ type: Schema.Types.Mixed }],
});

const NGO = mongoose.model("ngo", ngo);
module.exports = NGO;
