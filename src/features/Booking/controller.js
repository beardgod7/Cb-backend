const {
  upsertFormFieldTemplates,
  getAllFormFieldTemplates,
  createEventBooking,
  getAllEventBooking,
  getAllEventBookingByUserId,
  getEventBookingById,
  updateEventBooking,
  deleteEventBooking,
} = require("./repository");
const { EventBookingSchema } = require("./schema");

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

// // Create a booking with dynamic answers in metadata
// exports.createEventBooking = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const validatedData = await EventBookingSchema.validateAsync(req.body);
//     const newUserData = { ...validatedData, userId };
//     const newUser = await createEventBooking(newUserData);
//     return res.status(201).json({
//       message: "booking sucessfull.",
//     });
//   } catch (err) {
//     console.error("booking error: ", err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err.message });
//   }
// };
exports.createEventBooking = async (req, res, next) => {
  try {
    // Validate main fields but allow unknown keys
    const validatedData = await EventBookingSchema.validateAsync(req.body);
    const userId = req.userId;
    const knownFields = [
      "EventId",
      "FirstName",
      "LastName",
      "PhoneNumber",
      "status",
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
    res.status(201).json({ message: "Booking created", booking: newBooking });
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
