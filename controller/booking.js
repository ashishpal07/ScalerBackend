const Room = require("../models/room");
const Booking = require("../models/booking");
const User = require("../models/user");
const { findRefund } = require("../utils/room");
const { calculatePrice } = require("../utils/room");

const mailSender = require("../utils/mailSender");
const RoomBookingTemplate = require("../mail/template/bookingTemplate");

module.exports = {
  getAllbookings: async (req, res) => {
    try {
      let allbookings = await Booking.find();

      return res.status(200).json({
        allbookings,
        message: "All bookings are here",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error while getting all bookings!",
        err,
      });
    }
  },

  createBooking: async (req, res) => {
    try {
      const { email, startTime, endTime, roomNumber } = req.body;

      if (!email || !startTime || !endTime | !roomNumber) {
        return res.status(499).json({
          message: "All fields are required!",
        });
      }

      const findBookedRooms = await Booking.find({
        roomNumber: roomNumber,
        $or: [
          { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(startTime) } },
          { startTime: { $lte: new Date(endTime) }, endTime: { $gte: new Date(endTime) } },
        ],
      });

      if (findBookedRooms.length !== 0) {
        return res.status(409).json({
          message: `Room No ${roomNumber} is already booked.`,
        });
      }

      let room = await Room.findOne({ roomNumber: roomNumber });
      if (!room) {
        return res.status(404).json({
          message: `Invalid room number ${roomNumber}.`,
        });
      }

      let price = calculatePrice(
        room.roomType,
        new Date(startTime),
        new Date(endTime)
      );

      let booking = await Booking.create({
        email: email,
        room: room._id,
        roomNumber: roomNumber,
        roomType: room.roomType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price: price,
        expiredAt: new Date(endTime),
      });

      const emailResponse = await mailSender(
        booking.email,
        "Congratulations",
        "You have booked room successfully"
      );

      return res.status(200).json({
        booking,
        emailResponse,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error while booking room.",
      });
    }
  },

  updateBooking: async (req, res) => {
    try {
      let bookingId = req.params.id;
      const { email, startTime, endTime, roomNumber, roomType } = req.body;

      let booking = await Booking.findById(bookingId);

      if(!booking) {
        return res.status(404).json({
          message: `Booking not found with booking id ${bookingId}.`
        });
      }

      let findBookedRooms = await Booking.find(
        {
          roomNumber: roomNumber,
          startTime: { $gte: new Date(startTime) }, endTime: { $lt: new Date(endTime) },
        }
      );

      if (findBookedRooms.length !== 0) {
        return res.status(404).json({
          message: `Room ${roomType} is not avilable, at given period`,
        });
      }

      let room = await Room.findOne({ roomNumber: roomNumber });
      if (!room) {
        return res.status(404).json({
          message: `Room is not found with ${roomNumber}.`,
        });
      }

      let price = calculatePrice(
        roomType ? roomType: room.roomType,
        new Date(startTime),
        new Date(endTime)
      );

      let expiresIn = (new Date(endTime) - new Date()) / 3600000;

      let updateBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          email: email,
          room: room._id,
          roomNumber: roomNumber,
          roomType: roomType,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          price: price,
          expiredAt:  new Date(endTime),
        },
        { new: true }
      );

      const emailResponse = await mailSender(
        updateBooking.email,
        "Congratulations",
        "Your booking has updated successfully"
      );

      return res.status(200).json({
        updateBooking,
        emailResponse
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error while update booking",
      });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      let bookingId = req.params.id;

      let booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          message: `Booking is not present with this id ${bookingId}.`,
        });
      }

      let refund = findRefund(booking.startTime, booking.price);

      let deleteBooking = await Booking.findByIdAndDelete(bookingId);

      return res.status(200).json({
        message: `Booking gets deleted with id ${bookingId}.`,
        deleteBooking,
        refund
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error while cancel booking.",
      });
    }
  },

  getBookingsByFilter: async (req, res) => {
    try {
      let filters = {};

      if (req.params.roomNumber) {
        filters.roomNumber = req.params.roomNumber;
      }
      if (req.params.roomType) {
        filters.roomType = req.params.roomType;
      }
      if (req.body.startTime && req.body.endTime) {
        filters.startTime = {
          $gte: new Date(req.body.startTime),
          $lte: new Date(req.body.endTime),
        };
      }
      console.log("filter here1", filters);
      let bookings = await Booking.find(filters);
      return res.status(200).json({
        bookings,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal server error while find booking by filters!",
      });
    }
  },

  getBookingById: async (req, res) => {
    try {
      let bookingId = req.params.id;

      let booking = await Booking.findById(bookingId);
      if(!booking) {
        return res.status(404).json({
          message: "No booking found!"
        });
      }

      return res.status(200).json({
        booking
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error while finding booking byb id"
      });
    }
  }
};
