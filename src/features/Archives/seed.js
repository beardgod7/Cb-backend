/**
 * Seeds the 6 Archives collections and their sub-categories (from the spec) if
 * the collections table is empty. Runs once on boot; safe to re-run.
 */
const { ArchiveCollection, ArchiveSubcategory } = require("./model");

const SEED = [
  {
    slug: "colloquium",
    title: "Colloquium",
    itemKind: "document",
    order: 1,
    subs: ["Academic Papers", "Keynote Speeches", "Panel Discussions & Seminar Proceedings"],
  },
  {
    slug: "minutes-of-ifc",
    title: "Minutes of IFC",
    itemKind: "document",
    order: 2,
    subs: ["Meeting Minutes", "Internal Memos", "Planning & Coordination Documents"],
  },
  {
    slug: "photographs",
    title: "Photographs",
    itemKind: "photoSet",
    order: 3,
    subs: [
      "Events & Ceremonies",
      "Performances & Arts",
      "Participants & Delegates",
      "Cultural Moments & Environment",
    ],
  },
  {
    slug: "festac-id-cards",
    title: "FESTAC'77 Participants' Photo ID Cards",
    itemKind: "idCard",
    order: 4,
    subs: [
      "Delegates (Country Representatives)",
      "Artists & Performers",
      "Officials & Organizers (IFC, Staff)",
      "Media & Press",
    ],
  },
  {
    slug: "brochures",
    title: "Brochures",
    itemKind: "document",
    order: 5,
    subs: ["Opening & Closing Ceremonies", "Daily Event Schedules", "Special Events & Highlights"],
  },
  {
    slug: "black-and-african-scholars-papers",
    title: "Black & African Scholars' Papers",
    itemKind: "document",
    order: 6,
    subs: ["Opening & Closing Ceremonies", "Daily Event Schedules", "Special Events & Highlights"],
  },
];

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedArchives() {
  try {
    const count = await ArchiveCollection.count();
    if (count > 0) return;

    for (const c of SEED) {
      const col = await ArchiveCollection.create({
        slug: c.slug,
        title: c.title,
        itemKind: c.itemKind,
        order: c.order,
        isPublished: true,
      });
      let i = 0;
      for (const subTitle of c.subs) {
        await ArchiveSubcategory.create({
          collectionId: col.id,
          slug: slugify(subTitle),
          title: subTitle,
          order: i++,
        });
      }
    }
    console.log("Archives collections seeded.");
  } catch (err) {
    console.error("Archive seed error:", err.message);
  }
}

module.exports = { seedArchives };
