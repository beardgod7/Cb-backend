/**
 * Lets Library and Archives supply a way to look up a resource's title (and
 * confirm it exists) when a visit is booked, without Visits importing those
 * modules directly.
 *
 * resolver: async (resourceId) => ({ title }) | null
 */
const resolvers = new Map();

function registerVisitResource(resourceType, resolver) {
  resolvers.set(resourceType, resolver);
}

async function resolveResource(resourceType, resourceId) {
  const resolver = resolvers.get(resourceType);
  if (!resolver) return undefined; // unknown type -> caller decides
  return resolver(resourceId);
}

module.exports = { registerVisitResource, resolveResource };
