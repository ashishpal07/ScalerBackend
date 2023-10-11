
const express = require("express");
const route = express.Router();
const roomController = require("../controller/room");

route.get("/rooms", roomController.getAllRooms);

module.exports = route;
