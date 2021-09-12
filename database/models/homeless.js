var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var homeless = new Schema({
  number_of_people: {
    type: Number,
    required: true,
  },
  geo_location: {
    type: Map,
    required: true,
  },
  people_details: [{ type: homeless_person }],
  reported_by: {
    type: general_user,
    required: true,
  },
  media_url: {
    type: String,
    required: true,
  },
});

const HOMELESS = mongoose.model("homeless", homeless);
module.exports = HOMELESS;
