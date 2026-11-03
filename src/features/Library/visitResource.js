/**
 * Lets the Visits module resolve a library book's title (and confirm it exists)
 * when a visit is booked against resourceType "library".
 */
const { registerVisitResource } = require("../Visits/resourceRegistry");
const { Book } = require("./model");

registerVisitResource("library", async (resourceId) => {
  const book = await Book.findByPk(resourceId);
  if (!book) return null; // signals RESOURCE_NOT_FOUND
  return { title: book.title };
});

module.exports = {};
