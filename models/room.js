
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },

  roomType: {
    type: String,
    enum: ["ATYPE", "BTYPE", "CTYPE"],
    required: true,
  },

  pricePerHour: {
    type: Number,
    required: true,
  },

  // isBooked: {
  //   type: String,
  //   enum: ["BOOKED", "EMPTY"],
  //   default: "EMPTY",
  // },
});

module.exports = mongoose.model("Room", roomSchema);
