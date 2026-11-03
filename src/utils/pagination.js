/**
 * Pagination helpers for list endpoints.
 *
 * In:  ?page=&limit=
 * Out: { items, pagination: { page, limit, total, totalPages, hasNextPage } }
 */

/**
 * Parse page/limit from a query object, clamped to sane bounds.
 * @param {object} query req.query
 * @param {object} [opts]
 * @param {number} [opts.defaultLimit=20]
 * @param {number} [opts.maxLimit=100]
 * @returns {{ page: number, limit: number, offset: number }}
 */
function getPagination(query = {}, opts = {}) {
  const defaultLimit = opts.defaultLimit || 20;
  const maxLimit = opts.maxLimit || 100;

  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  return { page, limit, offset: (page - 1) * limit };
}

/**
 * Build the standard list payload.
 * @param {Array} items
 * @param {number} total total matching rows
 * @param {number} page
 * @param {number} limit
 */
function buildListResponse(items, total, page, limit) {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    },
  };
}

module.exports = { getPagination, buildListResponse };
