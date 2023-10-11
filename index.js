
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const PORT = process.env.PORT || 4000;

const db = require("./config/database");
db.connect();

app.use(express.json());

app.use(cors());

const bookingRoutes = require("./routes/booking");
const roomRoutes = require("./routes/room");
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", roomRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error while starting server ", err);
    return;
  }

  console.log(`Server is running on port ${PORT}`);
});