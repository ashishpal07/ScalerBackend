
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },

  lastName: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  accountType: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
    required: true,
  },

  // bookings: [
  //     {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Booking"
  //     }
  // ]
});

module.exports = mongoose.model("User", userSchema);
