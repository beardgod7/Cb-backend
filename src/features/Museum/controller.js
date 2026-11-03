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
const { ok, AppError } = require("../../utils/apiResponse");

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
    const { country, category, era, search, featured, page, limit } = req.query;
    const { getPagination, buildListResponse } = require("../../utils/pagination");

    const filter = {};
    if (country) filter.country = country;
    if (category) filter.category = category;
    if (era) filter.era = era;
    if (search) filter.search = search;
    if (featured === "true") filter.featured = true;

    if (page || limit) {
      const pg = getPagination(req.query, { defaultLimit: 20 });
      filter.page = pg.page;
      filter.limit = pg.limit;
      filter.offset = pg.offset;
      const { rows, count } = await repository.getAllArtifacts(filter);
      return res.status(200).json({
        success: true,
        message: "Artifacts retrieved successfully",
        data: buildListResponse(rows, count, pg.page, pg.limit),
      });
    }

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

    if (!validatedData.termsAccepted) {
      throw new AppError("TERMS_NOT_ACCEPTED", "You must accept the terms", 400);
    }
    if (validatedData.renterType !== "individual" && !validatedData.organization) {
      throw new AppError("ORGANIZATION_REQUIRED", "Organisation name is required", 400);
    }

    const artifact = await repository.getArtifactById(validatedData.artifactId);
    if (!artifact) {
      throw new AppError("NOT_FOUND", "Artifact not found", 404);
    }
    if (artifact.isRentable === false) {
      throw new AppError("NOT_RENTABLE", "This artefact cannot be rented", 400);
    }

    const fullName = `${validatedData.firstName} ${validatedData.lastName}`.trim();
    const requestData = {
      ...validatedData,
      fullName,
      userId,
      termsAcceptedAt: new Date(),
    };

    const request = await repository.createRentalRequest(requestData);

    // Emails (best-effort).
    try {
      await sendRentalRequestConfirmation(validatedData.email, {
        fullName,
        artifactTitle: artifact.title,
        identificationNumber: artifact.identificationNumber,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
      });
      await sendRentalRequestNotification({
        ...validatedData,
        fullName,
        artifactTitle: artifact.title,
        identificationNumber: artifact.identificationNumber,
      });
    } catch (e) {
      console.error("Rental email failed:", e.message);
    }

    return ok(res, {
      status: 201,
      message: "Your request has been sent to CBAAC. You will receive a response via email.",
      data: { id: request.id, status: request.status },
    });
  } catch (err) {
    next(err);
  }
}

async function getMyRentalRequests(req, res, next) {
  try {
    const requests = await repository.getRentalRequestsByUser(req.userId);
    return ok(res, { message: "Your rental requests", data: requests });
  } catch (err) {
    next(err);
  }
}

async function getTerms(req, res, next) {
  try {
    const t = await repository.getTerms();
    return ok(res, { message: "Museum terms", data: { version: t.version, body: t.body } });
  } catch (err) {
    next(err);
  }
}

async function updateTerms(req, res, next) {
  try {
    const t = await repository.updateTerms({ version: req.body.version, body: req.body.body });
    return ok(res, { message: "Museum terms updated", data: { version: t.version, body: t.body } });
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
  getMyRentalRequests,
  getTerms,
  updateTerms,
  createCollaborationRequest,
  getAllCollaborationRequests,
  updateCollaborationRequestStatus,
};
