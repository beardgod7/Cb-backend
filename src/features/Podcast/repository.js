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

async function getPublishedPodcasts(page = 1, limit = 10, filters = {}) {
  try {
    const offset = (page - 1) * limit;
    const where = { isPublished: true };
    if (filters.mediaType) where.mediaType = filters.mediaType;
    if (filters.season) where.season = parseInt(filters.season, 10);

    let order = [["publishedAt", "DESC"], ["createdAt", "DESC"]];
    if (filters.sort === "newest") order = [["publishedAt", "DESC"], ["createdAt", "DESC"]];
    else if (filters.sort === "oldest") order = [["publishedAt", "ASC"]];
    else if (filters.season) order = [["episodeNumber", "ASC"]];

    const { count, rows } = await Podcast.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
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

// Season headings with counts.
async function getSeasons(mediaType) {
  const where = { isPublished: true, season: { [Op.ne]: null } };
  if (mediaType) where.mediaType = mediaType;
  const rows = await Podcast.findAll({ where, order: [["season", "DESC"]] });
  const map = new Map();
  for (const p of rows) {
    const s = p.season;
    if (!map.has(s)) map.set(s, { season: s, episodeCount: 0, latestPublishedAt: null });
    const entry = map.get(s);
    entry.episodeCount += 1;
    const pub = p.publishedAt || p.createdAt;
    if (!entry.latestPublishedAt || new Date(pub) > new Date(entry.latestPublishedAt)) {
      entry.latestPublishedAt = pub;
    }
  }
  return [...map.values()].sort((a, b) => b.season - a.season);
}

async function getByIdOrSlug(idOrSlug) {
  let podcast = null;
  if (/^[0-9a-f]{8}-/i.test(idOrSlug)) {
    podcast = await Podcast.findByPk(idOrSlug);
  }
  if (!podcast) podcast = await Podcast.findOne({ where: { slug: idOrSlug } });
  return podcast;
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
  getSeasons,
  getByIdOrSlug,
};