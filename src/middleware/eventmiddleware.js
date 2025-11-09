const { Events } = require("../features/Events/model");

/**
 * Middleware to check if event registration is open
 * This validation is already done in the controller, so this middleware is optional
 * You can use it if you want to fail fast before reaching the controller
 */
async function checkRegistrationOpen(req, res, next) {
  try {
    const { EventId } = req.body;

    if (!EventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Events.findByPk(EventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.isPublished) {
      return res.status(400).json({ 
        message: "Event is not available for registration" 
      });
    }

    if (!event.registrationEnabled) {
      return res.status(400).json({ 
        message: "Registration is closed for this event" 
      });
    }

    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ 
        message: "Registration deadline has passed" 
      });
    }

    req.event = event;
    next();
  } catch (error) {
    console.error("Error in checkRegistrationOpen:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  checkRegistrationOpen,
};
