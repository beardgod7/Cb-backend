const { Artifact, RentalRequest, CollaborationRequest } = require("./model");
const { Op } = require("sequelize");

// ==================
// Artifacts
// ==================

async function createArtifact(artifactData) {
  return await Artifact.create(artifactData);
}

async function getAllArtifacts(filter = {}) {
  const where = { isActive: true };

  if (filter.country) {
    where.country = filter.country;
  }

  if (filter.category) {
    where.category = filter.category;
  }

  if (filter.era) {
    where.era = filter.era;
  }

  if (filter.featured) {
    where.isFeatured = true;
  }

  if (filter.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filter.search}%` } },
      { country: { [Op.iLike]: `%${filter.search}%` } },
      { category: { [Op.iLike]: `%${filter.search}%` } },
      { tags: { [Op.contains]: [filter.search] } },
    ];
  }

  return await Artifact.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
}

async function getArtifactById(id) {
  return await Artifact.findByPk(id);
}

async function getArtifactByIdentificationNumber(identificationNumber) {
  return await Artifact.findOne({ where: { identificationNumber } });
}

async function updateArtifact(id, updateData) {
  const artifact = await Artifact.findByPk(id);
  if (!artifact) throw new Error("Artifact not found");
  return await artifact.update(updateData);
}

async function deleteArtifact(id) {
  const artifact = await Artifact.findByPk(id);
  if (!artifact) throw new Error("Artifact not found");
  await artifact.destroy();
  return true;
}

async function getFeaturedArtifacts() {
  return await Artifact.findAll({
    where: { isActive: true, isFeatured: true },
    limit: 10,
  });
}

async function getUniqueCountries() {
  const artifacts = await Artifact.findAll({
    attributes: ["country"],
    where: { isActive: true },
    group: ["country"],
    raw: true,
  });
  return artifacts.map((a) => a.country).filter(Boolean);
}

async function getUniqueCategories() {
  const artifacts = await Artifact.findAll({
    attributes: ["category"],
    where: { isActive: true },
    group: ["category"],
    raw: true,
  });
  return artifacts.map((a) => a.category).filter(Boolean);
}

// ==================
// Rental Requests
// ==================

async function createRentalRequest(requestData) {
  return await RentalRequest.create(requestData);
}

async function getAllRentalRequests() {
  return await RentalRequest.findAll({
    include: [
      {
        model: Artifact,
        attributes: ["id", "identificationNumber", "title", "country"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function getRentalRequestById(id) {
  return await RentalRequest.findByPk(id, {
    include: [
      {
        model: Artifact,
        attributes: ["id", "identificationNumber", "title", "country", "images"],
      },
    ],
  });
}

async function updateRentalRequestStatus(id, status, adminNotes = null, adminResponse = null) {
  const request = await RentalRequest.findByPk(id);
  if (!request) throw new Error("Rental request not found");
  return await request.update({ status, adminNotes, adminResponse });
}

async function getRentalRequestsByUser(userId) {
  return await RentalRequest.findAll({
    where: { userId },
    include: [
      {
        model: Artifact,
        attributes: ["id", "identificationNumber", "title", "images"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

// ==================
// Collaboration Requests
// ==================

async function createCollaborationRequest(requestData) {
  return await CollaborationRequest.create(requestData);
}

async function getAllCollaborationRequests() {
  return await CollaborationRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getCollaborationRequestById(id) {
  return await CollaborationRequest.findByPk(id);
}

async function updateCollaborationRequestStatus(id, status, adminResponse = null) {
  const request = await CollaborationRequest.findByPk(id);
  if (!request) throw new Error("Collaboration request not found");
  return await request.update({ status, adminResponse });
}

module.exports = {
  createArtifact,
  getAllArtifacts,
  getArtifactById,
  getArtifactByIdentificationNumber,
  updateArtifact,
  deleteArtifact,
  getFeaturedArtifacts,
  getUniqueCountries,
  getUniqueCategories,
  createRentalRequest,
  getAllRentalRequests,
  getRentalRequestById,
  updateRentalRequestStatus,
  getRentalRequestsByUser,
  createCollaborationRequest,
  getAllCollaborationRequests,
  getCollaborationRequestById,
  updateCollaborationRequestStatus,
};
