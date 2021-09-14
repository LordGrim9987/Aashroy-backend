var mongoose = require("mongoose");
const locationSchema = require("./sub_schemas/location.schema");
var Schema = mongoose.Schema;
var crime_reports = new Schema({
  type: {
    type: String,
    required: true,
  },
  geo_location: {
    type: locationSchema,
    required: true,
  },
  brief_report: {
    type: String,
  },
  media_urls: [
    {
      type: String,
      required: true,
    },
  ],
});

const CRIME_REPORTS = mongoose.model("crime_reports", crime_reports);
module.exports = CRIME_REPORTS;
