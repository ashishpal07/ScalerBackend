
const express = require("express");
const route = express.Router();
const bookingController = require("../controller/booking");

route.post("/booking", bookingController.createBooking);

route.get("/booking", bookingController.getAllbookings);

route.get("/booking/filter/:roomNumber/:roomType", bookingController.getBookingsByFilter);

route.put("/booking/:id", bookingController.updateBooking);

route.delete("/booking/:id", bookingController.cancelBooking);

route.get("/booking/:id", bookingController.getBookingById);

module.exports = route;
