/**
 * Seeds the Black History Month programme + its 2025 edition if the programmes
 * table is empty. Also seeds the two fixed-page programmes as stubs so the
 * frontend grid has records. Idempotent.
 */
const { Programme, ProgrammeEdition } = require("./model");

async function seedProgrammes() {
  try {
    const count = await Programme.count();
    if (count > 0) return;

    const bhm = await Programme.create({
      slug: "black-history-month",
      title: "Black History Month",
      type: "annual",
      summary:
        "CBAAC's annual Black History Month celebrates the heritage, achievements and culture of Black and African peoples.",
      order: 1,
      isActive: true,
    });

    await ProgrammeEdition.create({
      programmeId: bhm.id,
      year: 2025,
      theme: "Reclaiming Our Narratives",
      summary:
        "<p>The 2025 edition explored how African stories are preserved and retold across generations.</p>",
      dates: { start: "2025-10-01", end: "2025-10-31" },
      gallery: [],
      isPublished: true,
    });

    await Programme.create({
      slug: "road-to-festac-at-50",
      title: "Road to FESTAC '77 @ 50",
      type: "special",
      summary: "Commemorating 50 years of the Second World Black and African Festival of Arts and Culture.",
      order: 2,
      isActive: true,
    });

    await Programme.create({
      slug: "paid",
      title: "PAID",
      type: "special",
      summary: "Pan-African initiatives and development programmes.",
      order: 3,
      isActive: true,
    });

    console.log("Programmes seeded (Black History Month 2025).");
  } catch (err) {
    console.error("Programme seed error:", err.message);
  }
}

module.exports = { seedProgrammes };
