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
    reverse_geocoding_address: {
      type: String,
      default: "",
    },
    reported_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "general_user",
    },
    media_url: [
      {
        url: {
          type: String,
        },
        media_type: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const HOMELESS = mongoose.model("homeless", homeless);
module.exports = HOMELESS;
