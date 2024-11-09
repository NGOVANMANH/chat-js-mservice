const errorHandlerMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandlerMiddleware;
