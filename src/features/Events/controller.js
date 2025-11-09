const repository = require("./repository");
const {
  eventSchema,
  updateEventSchema,
  albumSchema,
  updatealbumSchema,
} = require("./schema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../service/upload/cloudinaryuploader");
const { getBookingCountByEvent } = require("../Booking/repository");

async function createEvents(req, res, next) {
  try {
    const userId = req.userId;
    const offeringPictureUrls = [];

    // Define dynamic folder name
    const folderName = "Events";

    if (req.files && req.files.Images) {
      const files = req.files.Images.slice(0, 5);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        offeringPictureUrls.push(url);
      }
    }

    const offeringData = {
      ...req.body,
      Images: offeringPictureUrls,
    };

    const validatedData = await eventSchema.validateAsync(offeringData);

    const completeOfferingData = {
      userId,
      ...validatedData,
    };

    const newOffering = await repository.createEvents(completeOfferingData);
    return res.status(200).json({
      message: "Event created successfully",
      offering: newOffering,
    });
  } catch (err) {
    console.error("Error in eventOffering:", err);
    next(err);
  }
}

async function createAlbums(req, res, next) {
  try {
    const userId = req.userId;
    const offeringPictureUrls = [];

    // Define dynamic folder name
    const folderName = "Albums";

    if (req.files && req.files.Images) {
      const files = req.files.Images.slice(0, 5);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        offeringPictureUrls.push(url);
      }
    }

    const offeringData = {
      ...req.body,
      Images: offeringPictureUrls,
    };

    const validatedData = await albumSchema.validateAsync(offeringData);

    const completeOfferingData = {
      userId,
      ...validatedData,
    };

    const newOffering = await repository.createAlbums(completeOfferingData);
    return res.status(200).json({
      message: "Albums offering created successfully",
      offering: newOffering,
    });
  } catch (err) {
    console.error("Error in AlbumsOffering:", err);
    next(err);
  }
}
//updateAlbums
async function updateAlbums(req, res, next) {
  try {
    const { AlbumId } = req.params;
    const userId = req.userId;
    const updatedPictureUrls = [];

    // Define dynamic folder name
    const folderName = "Albums";

    if (req.files && req.files.Images) {
      const files = req.files.Images.slice(0, 5);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        updatedPictureUrls.push(url);
      }
    }

    const updateData = {
      ...req.body,
      Images: updatedPictureUrls.length > 0 ? updatedPictureUrls : undefined,
    };

    const validatedData = await updatealbumSchema.validateAsync(updateData);

    const updatedOffering = await repository.updateAlbums(
      AlbumId,
      validatedData
    );

    return res.status(200).json({
      message: "Albums offering updated successfully",
      offering: updatedOffering,
    });
  } catch (err) {
    console.error("Error in Albums offering:", err);
    next(err);
  }
}

async function updateEvents(req, res, next) {
  try {
    const { EventId } = req.params;
    const userId = req.userId;
    const updatedPictureUrls = [];

    // Define dynamic folder name
    const folderName = "Events";

    if (req.files && req.files.Images) {
      const files = req.files.Images.slice(0, 5);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        updatedPictureUrls.push(url);
      }
    }

    const updateData = {
      ...req.body,
      Images: updatedPictureUrls.length > 0 ? updatedPictureUrls : undefined,
    };

    const validatedData = await updateEventSchema.validateAsync(updateData);

    const updatedOffering = await repository.updateEvents(
      EventId,
      validatedData
    );

    return res.status(200).json({
      message: "event offering updated successfully",
      offering: updatedOffering,
    });
  } catch (err) {
    console.error("Error in event offering:", err);
    next(err);
  }
}

async function geteventsbyid(req, res, next) {
  try {
    const { id } = req.params;
    const offerings = await repository.getEventsById(id);
    res
      .status(200)
      .json({ message: "events retrieved successfully", data: offerings });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getAllevents(req, res, next) {
  try {
    const { status, published } = req.query;
    
    let offerings;
    
    if (published === "true") {
      offerings = await repository.getPublishedEvents();
    } else if (published === "false") {
      offerings = await repository.getDraftEvents();
    } else if (status) {
      offerings = await repository.getEventsByStatus(status);
    } else {
      offerings = await repository.getAllevents();
    }
    
    res
      .status(200)
      .json({ message: "Events retrieved successfully", data: offerings });
  } catch (err) {
    next(err);
  }
}

async function deleteeventsById(req, res) {
  const { id } = req.params;

  try {
    // Get listing and extract image public_ids
    const listing = await repository.getEventsById(id);
    const imagesToDelete = listing.picturesPublicIds || [];

    // Delete images from Cloudinary
    for (const publicId of imagesToDelete) {
      await deleteFromCloudinary(publicId);
    }

    // Delete the record
    await repository.deleteEvents(id);

    res.status(200).json({ message: "event and images deleted successfully" });
  } catch (error) {
    res.status(404).json({
      error: error.message || "Failed to delete levent or images",
    });
  }
}

async function deletealbumsById(req, res) {
  const { id } = req.params;

  try {
    // Get listing and extract image public_ids
    const listing = await repository.getAlbumsById(id);
    const imagesToDelete = listing.picturesPublicIds || [];

    // Delete images from Cloudinary
    for (const publicId of imagesToDelete) {
      await deleteFromCloudinary(publicId);
    }

    // Delete the record
    await repository.deleteAlbums(id);

    res.status(200).json({ message: "album and images deleted successfully" });
  } catch (error) {
    res.status(404).json({
      error: error.message || "Failed to delete album or images",
    });
  }
}

async function getAllalbum(req, res) {
  try {
    const categories = await repository.getAllAlbums();
    return res.status(200).json({ data: categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

async function getallbumById(req, res) {
  try {
    const { id } = req.params;
    const category = await repository.getAlbumsById(id);
    if (!category) {
      return res.status(404).json({ message: "album not found." });
    }

    return res.status(200).json({ data: category });
  } catch (err) {
    console.error("Fetch album by ID error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

// Publish event (Admin)
async function publishEvent(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await repository.togglePublishStatus(id, true);
    res.status(200).json({ 
      message: "Event published successfully", 
      event: updated 
    });
  } catch (err) {
    next(err);
  }
}

// Unpublish event (Admin)
async function unpublishEvent(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await repository.togglePublishStatus(id, false);
    res.status(200).json({ 
      message: "Event unpublished successfully", 
      event: updated 
    });
  } catch (err) {
    next(err);
  }
}

// Duplicate event (Admin)
async function duplicateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const duplicated = await repository.duplicateEvent(id);
    res.status(201).json({ 
      message: "Event duplicated successfully", 
      event: duplicated 
    });
  } catch (err) {
    next(err);
  }
}

// Get event statistics (Admin)
async function getEventStats(req, res, next) {
  try {
    const { id } = req.params;
    const event = await repository.getEventsById(id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrationCount = await getBookingCountByEvent(id);
    
    const stats = {
      eventId: id,
      title: event.Title,
      status: event.Status,
      isPublished: event.isPublished,
      registrationEnabled: event.registrationEnabled,
      volunteerEnabled: event.volunteerEnabled,
      maxAttendees: event.maxAttendees,
      currentRegistrations: registrationCount,
      availableSpots: event.maxAttendees ? event.maxAttendees - registrationCount : null,
      registrationDeadline: event.registrationDeadline,
    };

    res.status(200).json({ 
      message: "Event statistics retrieved successfully", 
      data: stats 
    });
  } catch (err) {
    next(err);
  }
}

// Get published events only (Public)
async function getPublishedEvents(req, res, next) {
  try {
    const events = await repository.getPublishedEvents();
    res.status(200).json({ 
      message: "Published events retrieved successfully", 
      data: events 
    });
  } catch (err) {
    next(err);
  }
}

// Get draft events (Admin)
async function getDraftEvents(req, res, next) {
  try {
    const events = await repository.getDraftEvents();
    res.status(200).json({ 
      message: "Draft events retrieved successfully", 
      data: events 
    });
  } catch (err) {
    next(err);
  }
}

// Get past events (Public)
async function getPastEvents(req, res, next) {
  try {
    const events = await repository.getEventsByStatus("past");
    res.status(200).json({ 
      message: "Past events retrieved successfully", 
      data: events 
    });
  } catch (err) {
    next(err);
  }
}

// Get upcoming events (Public)
async function getUpcomingEvents(req, res, next) {
  try {
    const events = await repository.getEventsByStatus("upcoming");
    res.status(200).json({ 
      message: "Upcoming events retrieved successfully", 
      data: events 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEvents,
  updateEvents,
  getAllevents,
  geteventsbyid,
  deleteeventsById,
  getAllalbum,
  getallbumById,
  createAlbums,
  updateAlbums,
  deletealbumsById,
  publishEvent,
  unpublishEvent,
  duplicateEvent,
  getEventStats,
  getPublishedEvents,
  getDraftEvents,
  getPastEvents,
  getUpcomingEvents,
};
