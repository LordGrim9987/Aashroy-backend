var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crime_reports = new Schema({
  type: {
    type: String,
    required: true,
  },
  geo_location: {
    type: String,
    required: true,
  },
  brief_report: {
    type: String,
  },
  media_url: {
    type: String,
    required: true,
  },
});

const CRIME_REPORTS = mongoose.model("crime_reports", crime_reports);
module.exports = CRIME_REPORTS;
