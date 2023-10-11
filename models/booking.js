
const mongoose = require("mongoose");
const BookingEmailTemplate = require("../mail/template/bookingTemplate")
const mailSender = require("../utils/mailSender");

const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },

  roomNumber: {
    type: String,
    required: true,
  },

  roomType: {
    type: String,
    enum: ["ATYPE", "BTYPE", "CTYPE"],
    required: true,
  },

  startTime: {
    type: Date,
    required: true,
  },

  endTime: {
    type: Date,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  expires: { type: Date, index: { expires: '0s' } },

});


async function sendBookingEmail(email, roomNumber, roomType, price) {
  try {
    await mailSender(
      email,
      "Successfully Booking  Email",
      BookingEmailTemplate.bookingTemplate(roomNumber, roomType, price, email),
    );
  } catch (err) {
    console.log("Error while send booking email ", err);
    throw err;
  }
}

bookingSchema.pre("save", async function (next) {
  sendBookingEmail(this.email, this.roomNumber, this.roomType, this.price);
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
