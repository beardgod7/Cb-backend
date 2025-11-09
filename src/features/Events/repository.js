const { Events, Albums } = require("./model");
/**
 * Creates an event.
 */
async function createEvents(offeringData) {
  return await Events.create(offeringData);
}

/**
 * Fetches all event including their location.
 */
async function getAllevents() {
  try {
    return await Events.findAll();
  } catch (err) {
    console.error("Error fetching offerings:", err.message);
    throw err;
  }
}

/**
 * Fetches a single event by ID including its location.
 */
async function getEventsById(EventId) {
  try {
    return await Events.findOne({
      where: { id: EventId },
    });
  } catch (err) {
    console.error("Error fetching events:", err.message);
    throw err;
  }
}

/**
 * Updates an event by its ID.
 */
async function updateEvents(EventId, updateData) {
  const offering = await Events.findByPk(EventId);
  if (!offering) throw new Error("Car offering not found");
  return await offering.update(updateData);
}

async function deleteEvents(EventId) {
  const offering = await Events.findByPk(EventId);
  if (!offering) {
    throw new Error("events not found");
  }
  await offering.destroy();
  return true;
}

// Ablums
/**
 * Creates a new Albums.
 */
async function createAlbums(offeringData) {
  return await Albums.create(offeringData);
}

/**
 * Fetches all Albums including their location.
 */
async function getAllAlbums() {
  try {
    return await Albums.findAll();
  } catch (err) {
    console.error("Error fetching Albums:", err.message);
    throw err;
  }
}

/**
 * Fetches a single Album by ID including its location.
 */
async function getAlbumsById(AlbumId) {
  try {
    return await Albums.findOne({
      where: { id: AlbumId },
    });
  } catch (err) {
    console.error("Error fetching Albums:", err.message);
    throw err;
  }
}

/**
 * Updates  Albums by its ID.
 */
async function updateAlbums(AlbumId, updateData) {
  const offering = await Albums.findByPk(AlbumId);
  if (!offering) throw new Error("Albums not found");
  return await offering.update(updateData);
}

async function deleteAlbums(AlbumId) {
  const offering = await Albums.findByPk(AlbumId);
  if (!offering) {
    throw new Error("Albums not found");
  }
  await offering.destroy();
  return true;
}

/**
 * Get published events only
 */
async function getPublishedEvents() {
  try {
    return await Events.findAll({
      where: { isPublished: true },
    });
  } catch (err) {
    console.error("Error fetching published events:", err.message);
    throw err;
  }
}

/**
 * Get draft (unpublished) events
 */
async function getDraftEvents() {
  try {
    return await Events.findAll({
      where: { isPublished: false },
    });
  } catch (err) {
    console.error("Error fetching draft events:", err.message);
    throw err;
  }
}

/**
 * Get events by status (past/upcoming)
 */
async function getEventsByStatus(status) {
  try {
    return await Events.findAll({
      where: { Status: status, isPublished: true },
    });
  } catch (err) {
    console.error("Error fetching events by status:", err.message);
    throw err;
  }
}

/**
 * Toggle event published status
 */
async function togglePublishStatus(EventId, isPublished) {
  const event = await Events.findByPk(EventId);
  if (!event) throw new Error("Event not found");
  return await event.update({ isPublished });
}

/**
 * Duplicate an event
 */
async function duplicateEvent(EventId) {
  const event = await Events.findByPk(EventId);
  if (!event) throw new Error("Event not found");
  
  const eventData = event.toJSON();
  delete eventData.id;
  delete eventData.createdAt;
  delete eventData.updatedAt;
  
  eventData.Title = `${eventData.Title} (Copy)`;
  eventData.isPublished = false;
  
  return await Events.create(eventData);
}

module.exports = {
  createEvents,
  getEventsById,
  updateEvents,
  getAllevents,
  deleteEvents,
  createAlbums,
  getAlbumsById,
  updateAlbums,
  getAllAlbums,
  deleteAlbums,
  getPublishedEvents,
  getDraftEvents,
  getEventsByStatus,
  togglePublishStatus,
  duplicateEvent,
};
