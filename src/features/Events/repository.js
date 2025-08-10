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
};
