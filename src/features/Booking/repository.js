const { FormFieldTemplate, EventBooking } = require("./model");

async function upsertFormFieldTemplates({
  EventId = null,
  isGlobal = false,
  fields,
}) {
  if (!Array.isArray(fields)) {
    throw new Error("Fields must be an array");
  }

  const whereClause = isGlobal ? { isGlobal: true } : { EventId };

  let existing = await FormFieldTemplate.findOne({ where: whereClause });

  if (existing) {
    await existing.update({
      fields,
      isGlobal,
      EventId: isGlobal ? null : EventId,
    });
    return { updated: [existing], created: [] };
  } else {
    const created = await FormFieldTemplate.create({
      fields,
      isGlobal,
      EventId: isGlobal ? null : EventId,
    });
    return { updated: [], created: [created] };
  }
}

async function getAllFormFieldTemplates(EventId) {
  // Try to get event-specific first, else fallback to global
  let template = await FormFieldTemplate.findOne({ where: { EventId } });
  if (!template) {
    template = await FormFieldTemplate.findOne({ where: { isGlobal: true } });
  }
  return template;
}

// // Fetch all reusable form fields (for displaying to user)
// async function getAllFormFieldTemplates() {
//   return await FormFieldTemplate.findAll();
// }

// Save user booking with dynamic answers in metadata
async function createEventBooking(EventBookingData) {
  try {
    return await EventBooking.create(EventBookingData);
  } catch (err) {
    console.log("Error creating EventBooking: " + err.message);
    throw new Error("Error creating EventBooking: " + err.message);
  }
}

// Fetch all bookings
async function getAllEventBooking() {
  return await EventBooking.findAll();
}

// Fetch bookings for a specific user
async function getAllEventBookingByUserId(userId) {
  return await EventBooking.findAll({ where: { userId } });
}

// Fetch single booking
async function getEventBookingById(id) {
  return await EventBooking.findByPk(id);
}

// Update booking
async function updateEventBooking(id, updateData) {
  const booking = await EventBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update(updateData);
}

// Delete booking
async function deleteEventBooking(id) {
  const booking = await EventBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  await booking.destroy();
  return true;
}

// Get bookings by event ID
async function getBookingsByEventId(EventId) {
  return await EventBooking.findAll({ where: { EventId } });
}

// Get booking count for an event
async function getBookingCountByEvent(EventId) {
  return await EventBooking.count({ where: { EventId } });
}

// Check if user already registered for event
async function checkDuplicateBooking(userId, EventId) {
  const existing = await EventBooking.findOne({
    where: { userId, EventId },
  });
  return !!existing;
}

// Get volunteers for an event
async function getVolunteersByEvent(EventId) {
  return await EventBooking.findAll({
    where: { EventId, registrationType: "Volunteer" },
  });
}

// Update booking status
async function updateBookingStatus(id, attendanceStatus) {
  const booking = await EventBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({ attendanceStatus });
}

// Get registration statistics for an event
async function getRegistrationStats(EventId) {
  const total = await EventBooking.count({ where: { EventId } });
  const registered = await EventBooking.count({
    where: { EventId, registrationType: "Register" },
  });
  const volunteers = await EventBooking.count({
    where: { EventId, registrationType: "Volunteer" },
  });
  const sponsors = await EventBooking.count({
    where: { EventId, registrationType: "Sponsor" },
  });

  return {
    total,
    registered,
    volunteers,
    sponsors,
  };
}

module.exports = {
  upsertFormFieldTemplates,
  getAllFormFieldTemplates,
  createEventBooking,
  getAllEventBooking,
  getAllEventBookingByUserId,
  getEventBookingById,
  updateEventBooking,
  deleteEventBooking,
  getBookingsByEventId,
  getBookingCountByEvent,
  checkDuplicateBooking,
  getVolunteersByEvent,
  updateBookingStatus,
  getRegistrationStats,
};
