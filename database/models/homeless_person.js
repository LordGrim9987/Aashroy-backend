var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var homeless_person = new Schema(
  {
    person_name: {
      type: String,
      required: true,
    },
    age_group: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    media_url: {
      url: {
        type: String,
      },
      media_type: {
        type: String,
      },
    },
    homeless: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "homeless",
    },
  },
  { timestamps: true }
);

const HOMELESS_PERSON = mongoose.model("homeless_person", homeless_person);
module.exports = HOMELESS_PERSON;
