var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ngo_work_detail = new Schema({
  title: {
    type: String,
    required: true,
  },
  geo_loaction: {
    type: Map,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media_urls: [{ type: String }],
});

const NGO_WORK_DETAILS = mongoose.model("ngo_work_details", ngo_work_detail);
module.exports = NGO_WORK_DETAILS;
