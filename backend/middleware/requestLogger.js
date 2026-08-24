// Custom requestLogger middleware (Task 3 Requirement)
// For every request logs: [METHOD] [PATH] [TIMESTAMP]
// Example: [GET] /api/v1/orders [2026-08-24T10:15:20.000Z]
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.originalUrl || req.url} [${timestamp}]`);
  next();
};

module.exports = requestLogger;
