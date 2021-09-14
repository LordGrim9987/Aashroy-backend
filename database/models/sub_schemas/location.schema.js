var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = locationSchema;
