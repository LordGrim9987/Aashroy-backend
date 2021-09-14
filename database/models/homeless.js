var mongoose = require("mongoose");
const locationSchema = require("./sub_schemas/location.schema");
var Schema = mongoose.Schema;
var homeless = new Schema(
  {
    number_of_people: {
      type: Number,
      required: true,
    },
    geo_location: {
      type: locationSchema,
      required: true,
    },
    reported_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "general_user",
    },
    media_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const HOMELESS = mongoose.model("homeless", homeless);
module.exports = HOMELESS;
