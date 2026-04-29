// server/middleware/errorHandler.js
// Centralised Express error + 404 handlers. Ensures every API response
// carries a consistent JSON shape and meaningful HTTP status codes.

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method,
  });
}

// Note: Express recognises this as an error-handling middleware because of
// the 4-arg signature — leave `_next` in place even though it is unused.
export function errorHandler(err, req, res, _next) {
  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 600
      ? err.status
      : 500;
  const message = err.message || 'Internal server error';

  // Log to the server console so developers see the stack trace during dev.
  console.error(`[server] ${req.method} ${req.originalUrl} →`, err);

  const response = {
    error: message,
    path: req.originalUrl,
    method: req.method,
  };

  if (err.details !== undefined) {
    response.details = err.details;
  }

  res.status(status).json(response);
}
