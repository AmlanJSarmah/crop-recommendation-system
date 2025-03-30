const mongoose = require("mongoose");

const stateDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  N: {
    type: Number,
    required: true,
  },
  P: {
    type: Number,
    required: true,
  },
  K: {
    type: Number,
    required: true,
  },
  rainfall: {
    type: Number,
    require: true,
  },
  ph: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("statedata", stateDataSchema);
