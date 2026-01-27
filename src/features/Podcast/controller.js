const repository = require("./repository");
const { podcastSchema, updatePodcastSchema } = require("./schema");

async function createPodcast(req, res, next) {
  try {
    const userId = req.userId;
    const validatedData = await podcastSchema.validateAsync(req.body);

    const podcastData = {
      userId,
      ...validatedData,
    };

    const newPodcast = await repository.createPodcast(podcastData);
    return res.status(201).json({
      message: "Podcast created successfully",
      podcast: newPodcast,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllPodcasts(req, res, next) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await repository.getAllPodcasts(page, limit, search);

    return res.status(200).json({
      message: "Podcasts retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getPodcastById(req, res, next) {
  try {
    const { id } = req.params;
    const podcast = await repository.getPodcastById(id);

    if (!podcast) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }

    return res.status(200).json({
      message: "Podcast retrieved successfully",
      podcast,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePodcast(req, res, next) {
  try {
    const { id } = req.params;
    const validatedData = await updatePodcastSchema.validateAsync(req.body);

    const updatedPodcast = await repository.updatePodcast(id, validatedData);

    if (!updatedPodcast) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }

    return res.status(200).json({
      message: "Podcast updated successfully",
      podcast: updatedPodcast,
    });
  } catch (error) {
    next(error);
  }
}

async function deletePodcast(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await repository.deletePodcast(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }

    return res.status(200).json({
      message: "Podcast deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getPublishedPodcasts(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await repository.getPublishedPodcasts(page, limit);

    return res.status(200).json({
      message: "Published podcasts retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getLivePodcasts(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await repository.getLivePodcasts(page, limit);

    return res.status(200).json({
      message: "Live podcasts retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
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