const repository = require("./repository");
const { podcastSchema, updatePodcastSchema } = require("./schema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../service/upload/cloudinaryuploader");

async function createPodcast(req, res, next) {
  try {
    const userId = req.userId;
    let audioUrl = null;
    let coverImageUrl = null;

    // Define dynamic folder name
    const folderName = "Podcasts";

    // Handle audio file upload
    if (req.files && req.files.audio && req.files.audio[0]) {
      const audioFile = req.files.audio[0];
      audioUrl = await uploadToCloudinary(
        audioFile.buffer,
        folderName,
        `${userId}-audio-${audioFile.originalname}`,
        "video" // Cloudinary resource type for audio files
      );
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const imageFile = req.files.coverImage[0];
      coverImageUrl = await uploadToCloudinary(
        imageFile.buffer,
        folderName,
        `${userId}-cover-${imageFile.originalname}`
      );
    }

    const podcastData = {
      ...req.body,
      audio: audioUrl,
      coverImage: coverImageUrl,
    };

    const validatedData = await podcastSchema.validateAsync(podcastData);

    const completePodcastData = {
      userId,
      ...validatedData,
      audio: audioUrl,
      coverImage: coverImageUrl,
    };

    const newPodcast = await repository.createPodcast(completePodcastData);
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
    let audioUrl = null;
    let coverImageUrl = null;

    // Get existing podcast to check for existing files
    const existingPodcast = await repository.getPodcastById(id);
    if (!existingPodcast) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }

    // Define dynamic folder name
    const folderName = "Podcasts";
    const userId = req.userId;

    // Handle audio file upload
    if (req.files && req.files.audio && req.files.audio[0]) {
      const audioFile = req.files.audio[0];
      
      // Delete old audio file if exists
      if (existingPodcast.audio) {
        try {
          await deleteFromCloudinary(existingPodcast.audio);
        } catch (deleteError) {
          console.warn("Failed to delete old audio file:", deleteError);
        }
      }

      audioUrl = await uploadToCloudinary(
        audioFile.buffer,
        folderName,
        `${userId}-audio-${audioFile.originalname}`,
        "video" // Cloudinary resource type for audio files
      );
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const imageFile = req.files.coverImage[0];
      
      // Delete old cover image if exists
      if (existingPodcast.coverImage) {
        try {
          await deleteFromCloudinary(existingPodcast.coverImage);
        } catch (deleteError) {
          console.warn("Failed to delete old cover image:", deleteError);
        }
      }

      coverImageUrl = await uploadToCloudinary(
        imageFile.buffer,
        folderName,
        `${userId}-cover-${imageFile.originalname}`
      );
    }

    const updateData = {
      ...req.body,
    };

    // Add file URLs if new files were uploaded
    if (audioUrl) updateData.audio = audioUrl;
    if (coverImageUrl) updateData.coverImage = coverImageUrl;

    const validatedData = await updatePodcastSchema.validateAsync(updateData);

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
    
    // Get podcast to delete associated files
    const podcast = await repository.getPodcastById(id);
    if (!podcast) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }

    // Delete associated files from Cloudinary
    if (podcast.audio) {
      try {
        await deleteFromCloudinary(podcast.audio);
      } catch (deleteError) {
        console.warn("Failed to delete audio file:", deleteError);
      }
    }

    if (podcast.coverImage) {
      try {
        await deleteFromCloudinary(podcast.coverImage);
      } catch (deleteError) {
        console.warn("Failed to delete cover image:", deleteError);
      }
    }

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