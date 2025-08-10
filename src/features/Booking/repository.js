const { EventBooking } = require("./model");

/**
 * Creates a new appointment.
 */
async function createEventBooking(EventBookingData) {
  try {
    return await EventBooking.create(EventBookingData);
  } catch (err) {
    console.log("Error creating EventBooking: " + err.message);
    throw new Error("Error creating EventBooking: " + err.message);
  }
}

async function getAllEventBooking() {
  try {
    return await EventBooking.findAll();
  } catch (err) {
    console.log("Error fetching EventBooking: " + err.message);
    throw new Error("Error fetching EventBooking: " + err.message);
  }
}

/**
 * Fetches all EventBooking for a specific provider.
 * @param {UUID} userId - The provider's ID.
 * @returns {Promise<[]>} - List of appointments.
 */
async function getAllEventBookingbyusersid(userId) {
  try {
    return await EventBooking.findAll({
      where: { userId: userId },
    });
  } catch (err) {
    console.log("Error fetching EventBooking: " + err.message);
    throw new Error("Error fetching EventBooking: " + err.message);
  }
}

/**
 * Fetches a specific EventBooking by its ID.
 * @param {UUID} EventBookingId - The appointment ID.
 * @returns {Promise<Appointment|null>} - The appointment details or null if not found.
 */
async function getEventBookingById(EventBookingId) {
  try {
    return await EventBooking.findByPk(EventBookingId);
  } catch (err) {
    console.log("Error fetching EventBooking: " + err.message);
    throw new Error("Error fetching EventBooking by ID: " + err.message);
  }
}

/**
 * Updates an appointment by its ID.
 * @param {UUID} appointmentId - The appointment ID.
 * @param {Object} updateData - The data to update the appointment with.
 * @returns {Promise<Appointment>} - The updated appointment.
 */
async function updateEventBooking(EventBookingId, updateData) {
  try {
    const appointment = await EventBooking.findByPk(EventBookingId);
    if (!appointment) throw new Error("Appointment not found");
    return await appointment.update(updateData);
  } catch (err) {
    console.log("Error updating EventBooking: " + err.message);
    throw new Error("Error updating EventBooking: " + err.message);
  }
}

/**
 * Deletes an appointment by its ID.
 * @param {UUID} EventBooking - The appointment ID.
 * @returns {Promise<boolean>} - Returns true if deletion was successful.
 */
async function deleteEventBooking(EventBookingId) {
  try {
    const appointment = await EventBooking.findByPk(EventBookingId);
    if (!appointment) throw new Error("EventBooking not found");
    await appointment.destroy();
    return true;
  } catch (err) {
    console.log("Error deleting EventBooking " + err.message);
    throw new Error("Error deleting EventBooking: " + err.message);
  }
}

/**
 * Updates the status of an appointment.
 * @param {UUID} EventBookingId - The appointment ID.
 * @param {string} status - The new status of the appointment.
 * @returns {Promise<Appointment>} - The updated appointment.
 */
async function updateEventBookingStatus(EventBookingId, status) {
  try {
    const appointment = await EventBooking.findByPk(EventBookingId);
    if (!appointment) throw new Error("Appointment not found");
    appointment.status = status;
    return await appointment.save();
  } catch (err) {
    console.log("Error updating appointment status: " + err.message);
    throw new Error("Error updating appointment status: " + err.message);
  }
}

module.exports = {
  createEventBooking,
  getAllEventBookingbyusersid,
  getEventBookingById,
  updateEventBooking,
  deleteEventBooking,
  updateEventBookingStatus,
  getAllEventBooking,
};
