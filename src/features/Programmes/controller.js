const { Op } = require("sequelize");
const { Programme, ProgrammeEdition } = require("./model");
const {
  programmeSchema,
  updateProgrammeSchema,
  editionSchema,
  updateEditionSchema,
} = require("./schema");
const { ok, AppError } = require("../../utils/apiResponse");

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ===== Public =====
async function listProgrammes(req, res, next) {
  try {
    const where = { isActive: true };
    if (req.query.type) where.type = req.query.type;
    if (req.query.search) {
      const q = `%${req.query.search}%`;
      where[Op.or] = [{ title: { [Op.iLike]: q } }, { summary: { [Op.iLike]: q } }];
    }
    const programmes = await Programme.findAll({ where, order: [["order", "ASC"], ["createdAt", "DESC"]] });
    return ok(res, { message: "Programmes", data: programmes });
  } catch (err) {
    next(err);
  }
}

async function getProgramme(req, res, next) {
  try {
    const programme = await Programme.findOne({ where: { slug: req.params.slug, isActive: true } });
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    return ok(res, { message: "Programme", data: programme });
  } catch (err) {
    next(err);
  }
}

async function listEditions(req, res, next) {
  try {
    const programme = await Programme.findOne({ where: { slug: req.params.slug } });
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    const editions = await ProgrammeEdition.findAll({
      where: { programmeId: programme.id, isPublished: true },
      order: [["year", "DESC"]],
    });
    return ok(res, {
      message: "Editions",
      data: editions.map((e) => ({ year: e.year, theme: e.theme })),
    });
  } catch (err) {
    next(err);
  }
}

async function getEdition(req, res, next) {
  try {
    const programme = await Programme.findOne({ where: { slug: req.params.slug } });
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    const edition = await ProgrammeEdition.findOne({
      where: { programmeId: programme.id, year: parseInt(req.params.year, 10), isPublished: true },
    });
    if (!edition) throw new AppError("NOT_FOUND", "Edition not found", 404);
    return ok(res, {
      message: "Edition",
      data: {
        year: edition.year,
        theme: edition.theme,
        summary: edition.summary,
        dates: edition.dates,
        heroImage: edition.heroImage,
        gallery: edition.gallery || [],
      },
    });
  } catch (err) {
    next(err);
  }
}

// ===== Admin =====
async function createProgramme(req, res, next) {
  try {
    const data = await programmeSchema.validateAsync(req.body);
    if (!data.slug) data.slug = slugify(data.title);
    const programme = await Programme.create(data);
    return ok(res, { status: 201, message: "Programme created", data: programme });
  } catch (err) {
    next(err);
  }
}

async function updateProgramme(req, res, next) {
  try {
    const data = await updateProgrammeSchema.validateAsync(req.body);
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    Object.assign(programme, data);
    await programme.save();
    return ok(res, { message: "Programme updated", data: programme });
  } catch (err) {
    next(err);
  }
}

async function deleteProgramme(req, res, next) {
  try {
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    await programme.destroy();
    return ok(res, { message: "Programme deleted" });
  } catch (err) {
    next(err);
  }
}

async function createEdition(req, res, next) {
  try {
    const data = await editionSchema.validateAsync(req.body);
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    const edition = await ProgrammeEdition.create({ ...data, programmeId: programme.id });
    return ok(res, { status: 201, message: "Edition created", data: edition });
  } catch (err) {
    next(err);
  }
}

async function updateEdition(req, res, next) {
  try {
    const data = await updateEditionSchema.validateAsync(req.body);
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    const edition = await ProgrammeEdition.findOne({
      where: { programmeId: programme.id, year: parseInt(req.params.year, 10) },
    });
    if (!edition) throw new AppError("NOT_FOUND", "Edition not found", 404);
    Object.assign(edition, data);
    await edition.save();
    return ok(res, { message: "Edition updated", data: edition });
  } catch (err) {
    next(err);
  }
}

async function deleteEdition(req, res, next) {
  try {
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) throw new AppError("NOT_FOUND", "Programme not found", 404);
    await ProgrammeEdition.destroy({
      where: { programmeId: programme.id, year: parseInt(req.params.year, 10) },
    });
    return ok(res, { message: "Edition deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProgrammes,
  getProgramme,
  listEditions,
  getEdition,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  createEdition,
  updateEdition,
  deleteEdition,
};
