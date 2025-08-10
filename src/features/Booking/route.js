const express = require("express");
const controller = require("./controller");

const router = express.Router();

//router.get("/userbooking", controller.getuserEventbooking);
router.get("/Eventbooking/:EventId", controller.getEventbookingbyid);
router.get("/Eventbooking", controller.getallEventbooking);
router.post("/booking", controller.createEventBooking);
//router.put("/status/:EventId", controller.updateEventBookingStatusController);

module.exports = router;
