const { Podcast } = require("./model");
const { Op } = require("sequelize");

async function createPodcast(podcastData) {
  try {
    const podcast = await Podcast.create(podcastData);
    return podcast;
  } catch (error) {
    throw error;
  }
}

async function getAllPodcasts(page = 1, limit = 10, search = "") {
  try {
    const offset = (page - 1) * limit;
    const whereClause = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Podcast.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return {
      podcasts: rows,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw error;
  }
}

async function getPodcastById(id) {
  try {
    const podcast = await Podcast.findByPk(id);
    return podcast;
  } catch (error) {
    throw error;
  }
}

async function updatePodcast(id, updateData) {
  try {
    const [updatedRowsCount] = await Podcast.update(updateData, {
      where: { id },
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    const updatedPodcast = await Podcast.findByPk(id);
    return updatedPodcast;
  } catch (error) {
    throw error;
  }
}

async function deletePodcast(id) {
  try {
    const deletedRowsCount = await Podcast.destroy({
      where: { id },
    });

    return deletedRowsCount > 0;
  } catch (error) {
    throw error;
  }
}

async function getPublishedPodcasts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Podcast.findAndCountAll({
      where: { isPublished: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return {
      podcasts: rows,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw error;
  }
}

async function getLivePodcasts(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Podcast.findAndCountAll({
      where: { isLive: true, isPublished: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return {
      podcasts: rows,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPodcast,
  getAllPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
  getPublishedPodcasts,
  getLivePodcasts,
};