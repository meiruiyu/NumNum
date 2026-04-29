// server/utils/http.js
// Shared HTTP helpers for route validation and consistent error semantics.

export class HttpError extends Error {
  constructor(status, message, details = undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export function assertNonEmptyString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required`);
  }
  return value.trim();
}

export function assertIdParam(value, fieldName = 'id') {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
}

export function parsePagination(query, defaults = { limit: 20, maxLimit: 100 }) {
  const rawLimit = query?.limit;
  const rawOffset = query?.offset;

  const limit =
    rawLimit === undefined
      ? defaults.limit
      : Number.parseInt(String(rawLimit), 10);
  const offset =
    rawOffset === undefined
      ? 0
      : Number.parseInt(String(rawOffset), 10);

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new HttpError(400, 'limit must be a positive integer');
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new HttpError(400, 'offset must be a non-negative integer');
  }

  return {
    limit: Math.min(limit, defaults.maxLimit),
    offset,
  };
}
