/**
 * Lets the Visits module resolve an archive item's title (and confirm it exists)
 * when a visit is booked against resourceType "archive".
 */
const { registerVisitResource } = require("../Visits/resourceRegistry");
const { ArchiveItem } = require("./model");

registerVisitResource("archive", async (resourceId) => {
  const item = await ArchiveItem.findByPk(resourceId);
  if (!item) return null; // signals RESOURCE_NOT_FOUND
  return { title: item.title };
});

module.exports = {};
