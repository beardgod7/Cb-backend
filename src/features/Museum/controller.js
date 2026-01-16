const repository = require("./repository");
const {
  artifactSchema,
  updateArtifactSchema,
  rentalRequestSchema,
  collaborationRequestSchema,
} = require("./schema");
const { uploadToCloudinary } = require("../../service/upload/cloudinaryuploader");
const {
  sendRentalRequestConfirmation,
  sendRentalRequestNotification,
  sendCollaborationRequestNotification,
} = require("../../service/emailservice");

// ==================
// Artifacts (Admin)
// ==================

async function createArtifact(req, res, next) {
  try {
    const userId = req.userId;
    const imageUrls = [];
    let audioUrl = null;
    const folderName = "Museum/Artifacts";

    // Upload artifact images
    if (req.files && req.files.images) {
      const files = req.files.images.slice(0, 10); // Max 10 images
      for (const file of files) {
        try {
          const url = await uploadToCloudinary(
            file.buffer,
            folderName,
            `${req.body.identificationNumber}-${file.originalname}`
          );
          imageUrls.push(url);
        } catch (error) {
          console.error("Error uploading image:", error);
          return res.status(400).json({ 
            message: `Failed to upload image: ${file.originalname}`, 
            error: error.message 
          });
        }
      }
    }

    // Upload audio narration
    if (req.files && req.files.audioNarration && req.files.audioNarration[0]) {
      try {
        audioUrl = await uploadToCloudinary(
          req.files.audioNarration[0].buffer,
          `${folderName}/Audio`,
          `audio-${req.body.identificationNumber}`,
          { resource_type: "video" } // Cloudinary uses 'video' for audio files
        );
      } catch (error) {
        console.error("Error uploading audio:", error);
        return res.status(400).json({ 
          message: "Failed to upload audio file", 
          error: error.message 
        });
      }
    }

    const artifactData = {
      ...req.body,
      images: imageUrls,
      audioNarration: audioUrl,
      createdBy: userId,
    };

    // Parse tags if it's a string
    if (typeof artifactData.tags === "string") {
      artifactData.tags = JSON.parse(artifactData.tags);
    }

    const validatedData = await artifactSchema.validateAsync(artifactData);
    const artifact = await repository.createArtifact(validatedData);

    res.status(201).json({
      message: "Artifact created successfully",
      artifact,
    });
  } catch (err) {
    console.error("Error creating artifact:", err);
    next(err);
  }
}

async function updateArtifact(req, res, next) {
  try {
    const { id } = req.params;
    const imageUrls = [];
    let audioUrl = null;
    const folderName = "Museum/Artifacts";

    // Upload new images if provided
    if (req.files && req.files.images) {
      const files = req.files.images.slice(0, 10);
      for (const file of files) {
        try {
          const url = await uploadToCloudinary(
            file.buffer,
            folderName,
            `${req.body.identificationNumber || id}-${file.originalname}`
          );
          imageUrls.push(url);
        } catch (error) {
          console.error("Error uploading image:", error);
          return res.status(400).json({ 
            message: `Failed to upload image: ${file.originalname}`, 
            error: error.message 
          });
        }
      }
    }

    // Upload new audio if provided
    if (req.files && req.files.audioNarration && req.files.audioNarration[0]) {
      try {
        audioUrl = await uploadToCloudinary(
          req.files.audioNarration[0].buffer,
          `${folderName}/Audio`,
          `audio-${req.body.identificationNumber || id}`,
          { resource_type: "video" }
        );
      } catch (error) {
        console.error("Error uploading audio:", error);
        return res.status(400).json({ 
          message: "Failed to upload audio file", 
          error: error.message 
        });
      }
    }

    const updateData = {
      ...req.body,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      audioNarration: audioUrl || undefined,
    };

    // Parse tags if it's a string
    if (typeof updateData.tags === "string") {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const validatedData = await updateArtifactSchema.validateAsync(updateData);
    const artifact = await repository.updateArtifact(id, validatedData);

    res.status(200).json({
      message: "Artifact updated successfully",
      artifact,
    });
  } catch (err) {
    console.error("Error updating artifact:", err);
    next(err);
  }
}

async function deleteArtifact(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteArtifact(id);

    res.status(200).json({ message: "Artifact deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Artifacts (Public)
// ==================

async function getAllArtifacts(req, res, next) {
  try {
    const { country, category, era, search, featured } = req.query;

    const filter = {};
    if (country) filter.country = country;
    if (category) filter.category = category;
    if (era) filter.era = era;
    if (search) filter.search = search;
    if (featured === "true") filter.featured = true;

    const artifacts = await repository.getAllArtifacts(filter);

    res.status(200).json({
      message: "Artifacts retrieved successfully",
      data: artifacts,
    });
  } catch (err) {
    next(err);
  }
}

async function getArtifactById(req, res, next) {
  try {
    const { id } = req.params;
    const artifact = await repository.getArtifactById(id);

    if (!artifact) {
      return res.status(404).json({ message: "Artifact not found" });
    }

    res.status(200).json({
      message: "Artifact retrieved successfully",
      data: artifact,
    });
  } catch (err) {
    next(err);
  }
}

async function getFeaturedArtifacts(req, res, next) {
  try {
    const artifacts = await repository.getFeaturedArtifacts();

    res.status(200).json({
      message: "Featured artifacts retrieved successfully",
      data: artifacts,
    });
  } catch (err) {
    next(err);
  }
}

async function getFilterOptions(req, res, next) {
  try {
    const countries = await repository.getUniqueCountries();
    const categories = await repository.getUniqueCategories();

    res.status(200).json({
      message: "Filter options retrieved successfully",
      data: {
        countries,
        categories,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Rental Requests
// ==================

async function createRentalRequest(req, res, next) {
  try {
    const validatedData = await rentalRequestSchema.validateAsync(req.body);
    const userId = req.userId || null;

    const artifact = await repository.getArtifactById(validatedData.artifactId);
    if (!artifact) {
      return res.status(404).json({ message: "Artifact not found" });
    }

    const requestData = {
      ...validatedData,
      userId,
    };

    const request = await repository.createRentalRequest(requestData);

    // Send confirmation to user
    await sendRentalRequestConfirmation(validatedData.email, {
      fullName: validatedData.fullName,
      artifactTitle: artifact.title,
      identificationNumber: artifact.identificationNumber,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
    });

    // Send notification to admin
    await sendRentalRequestNotification({
      ...validatedData,
      artifactTitle: artifact.title,
      identificationNumber: artifact.identificationNumber,
    });

    res.status(201).json({
      message: "Rental request submitted successfully. Confirmation email sent.",
      request,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllRentalRequests(req, res, next) {
  try {
    const requests = await repository.getAllRentalRequests();

    res.status(200).json({
      message: "Rental requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(err);
  }
}

async function updateRentalRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes, adminResponse } = req.body;

    const request = await repository.updateRentalRequestStatus(
      id,
      status,
      adminNotes,
      adminResponse
    );

    res.status(200).json({
      message: "Rental request updated successfully",
      request,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserRentalRequests(req, res, next) {
  try {
    const { userId } = req.params;
    const requests = await repository.getRentalRequestsByUser(userId);

    res.status(200).json({
      message: "User rental requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Collaboration Requests
// ==================

async function createCollaborationRequest(req, res, next) {
  try {
    const validatedData = await collaborationRequestSchema.validateAsync(req.body);
    const request = await repository.createCollaborationRequest(validatedData);

    // Send notification to admin
    await sendCollaborationRequestNotification(validatedData);

    res.status(201).json({
      message: "Collaboration request submitted successfully",
      request,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllCollaborationRequests(req, res, next) {
  try {
    const requests = await repository.getAllCollaborationRequests();

    res.status(200).json({
      message: "Collaboration requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCollaborationRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const request = await repository.updateCollaborationRequestStatus(
      id,
      status,
      adminResponse
    );

    res.status(200).json({
      message: "Collaboration request updated successfully",
      request,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createArtifact,
  updateArtifact,
  deleteArtifact,
  getAllArtifacts,
  getArtifactById,
  getFeaturedArtifacts,
  getFilterOptions,
  createRentalRequest,
  getAllRentalRequests,
  updateRentalRequestStatus,
  getUserRentalRequests,
  createCollaborationRequest,
  getAllCollaborationRequests,
  updateCollaborationRequestStatus,
};
