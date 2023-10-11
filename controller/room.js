
const Room = require("../models/room");

module.exports = {

    getAllRooms: async (req, res) => {
        try {
            let rooms = await Room.find();
            return res.status(200).json({
                rooms
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error while fetching all rooms"
            });
        }
    }

}