const {
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
} = require("./repository");
const { EventBookingSchema, updateBookingStatusSchema } = require("./schema");
const { Events } = require("../Events/model");
const { exportAttendeesToCSV } = require("../../utils/exportHelper");
const {
  sendRegistrationConfirmation,
  sendVolunteerConfirmation,
  sendBroadcastToAttendees,
  sendEventUpdate,
} = require("../../service/emailservice");

// =====================
// Admin: Form Templates
// =====================

exports.createOrUpdateTemplate = async (req, res) => {
  try {
    const { EventId, isGlobal, fields } = req.body;

    const result = await upsertFormFieldTemplates({
      EventId,
      isGlobal,
      fields,
    });

    res.status(200).json({
      message: "Form field template processed successfully",
      result,
    });
  } catch (error) {
    console.error("Error in createOrUpdateTemplate:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get form field templates by EventId (fallback to global)
exports.getTemplate = async (req, res) => {
  try {
    const { EventId } = req.params;

    const template = await getAllFormFieldTemplates(EventId);

    if (!template) {
      return res.status(404).json({ message: "No template found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error in getTemplate:", error);
    res.status(500).json({ message: error.message });
  }
};

// =====================
// User: Event Bookings
// =====================

exports.createEventBooking = async (req, res, next) => {
  try {
    const validatedData = await EventBookingSchema.validateAsync(req.body);
    const userId = req.userId;
    const { EventId, registrationType, Email } = validatedData;

    // Get event details
    const event = await Events.findByPk(EventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is published
    if (!event.isPublished) {
      return res.status(400).json({ message: "Event is not available for registration" });
    }

    // Check if registration is enabled
    if (!event.registrationEnabled) {
      return res.status(400).json({ message: "Registration is closed for this event" });
    }

    // Check if volunteer registration is allowed
    if (registrationType === "Volunteer" && !event.volunteerEnabled) {
      return res.status(400).json({ message: "Volunteer registration is not enabled for this event" });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // Check for duplicate booking
    const isDuplicate = await checkDuplicateBooking(userId, EventId);
    if (isDuplicate) {
      return res.status(400).json({ message: "You have already registered for this event" });
    }

    // Check event capacity
    if (event.maxAttendees) {
      const currentCount = await getBookingCountByEvent(EventId);
      if (currentCount >= event.maxAttendees) {
        return res.status(400).json({ message: "Event is at full capacity" });
      }
    }

    const knownFields = [
      "EventId",
      "FirstName",
      "LastName",
      "PhoneNumber",
      "Email",
      "registrationType",
    ];

    // Extract unknown fields into metadata
    const metadata = {};
    for (const key in req.body) {
      if (!knownFields.includes(key)) {
        metadata[key] = req.body[key];
      }
    }

    const bookingData = {
      ...validatedData,
      userId,
      metadata,
    };

    const newBooking = await createEventBooking(bookingData);

    // Send confirmation email
    const eventDetails = {
      Title: event.Title,
      Date: event.Date,
      Location: event.Location,
      eventType: event.eventType,
      Organizer: event.Organizer,
    };

    const bookingDetails = {
      FirstName: validatedData.FirstName,
      LastName: validatedData.LastName,
      registrationType: registrationType || "Register",
    };

    if (Email) {
      if (registrationType === "Volunteer") {
        await sendVolunteerConfirmation(Email, eventDetails, bookingDetails);
      } else {
        await sendRegistrationConfirmation(Email, eventDetails, bookingDetails);
      }
    }

    res.status(201).json({ 
      message: "Registration successful! Confirmation email sent.", 
      booking: newBooking 
    });
  } catch (err) {
    next(err);
  }
};

// Get all bookings (admin view)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await getAllEventBooking();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for a specific user
exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await getAllEventBookingByUserId(req.params.userId);
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await getEventBookingById(req.params.id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const updated = await updateEventBooking(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await deleteEventBooking(req.params.id);
    res.status(200).json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings by event ID (Admin)
exports.getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await getBookingsByEventId(eventId);
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Export attendees to CSV (Admin)
exports.exportAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await getBookingsByEventId(eventId);
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No attendees found for this event" });
    }

    const csv = exportAttendeesToCSV(bookings);
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=attendees-${eventId}.csv`);
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send broadcast email to all attendees (Admin)
exports.sendBroadcast = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const event = await Events.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookings = await getBookingsByEventId(eventId);
    const emails = bookings
      .filter((b) => b.Email)
      .map((b) => b.Email);

    if (emails.length === 0) {
      return res.status(404).json({ message: "No attendees with email addresses found" });
    }

    await sendBroadcastToAttendees(emails, event.Title, subject, message, event.Organizer);

    res.status(200).json({ 
      success: true, 
      message: `Broadcast sent to ${emails.length} attendees` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send event update email (Admin)
exports.sendUpdate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { updateMessage } = req.body;

    if (!updateMessage) {
      return res.status(400).json({ message: "Update message is required" });
    }

    const event = await Events.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookings = await getBookingsByEventId(eventId);
    const emails = bookings
      .filter((b) => b.Email)
      .map((b) => b.Email);

    if (emails.length === 0) {
      return res.status(404).json({ message: "No attendees with email addresses found" });
    }

    await sendEventUpdate(emails, event.Title, updateMessage, event.Organizer);

    res.status(200).json({ 
      success: true, 
      message: `Update sent to ${emails.length} attendees` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update booking status (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = await updateBookingStatusSchema.validateAsync(req.body);
    
    const updated = await updateBookingStatus(id, validatedData.attendanceStatus);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get registration statistics (Admin)
exports.getStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const stats = await getRegistrationStats(eventId);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
