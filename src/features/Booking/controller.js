const repository = require("./repository");
const { EventBookingSchema, updateEventBookingSchema } = require("./schema");

async function createEventBooking(req, res, next) {
  try {
    const userId = req.userId;
    const validatedData = await EventBookingSchema.validateAsync(req.body);
    const newUserData = { ...validatedData, userId };
    const newUser = await repository.createEventBooking(newUserData);
    return res.status(201).json({
      message: "booking sucessfull.",
    });
  } catch (err) {
    console.error("booking error: ", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

/**
 * Controller to update the status of an appointment.
 */
async function updateEventBookingStatusController(req, res) {
  try {
    const { EventId } = req.params;

    const { status } = req.body;
    //const reciever = await repository.getAppointmentById(appointmentId);
    const updatedAppointment = await repository.updateEventBookingStatus(
      EventId,
      status
    );
    return res.status(200).json({
      message: " bookings updated successfully.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.log(error);
  }
}

// Function to get user by ID
const getuserEventbooking = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await repository.getAllEventBookingbyusersid(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to get user by ID
const getEventbookingbyid = async (req, res) => {
  const { EventId } = req.params;
  try {
    const user = await repository.getEventBookingById(EventId);
    if (!user) {
      return res.status(404).json({ message: "event booking not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to get user by ID
const getallEventbooking = async (req, res) => {
  try {
    const user = await repository.getAllEventBooking();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createEventBooking,
  getallEventbooking,
  getEventbookingbyid,
  getuserEventbooking,
  updateEventBookingStatusController,
};
