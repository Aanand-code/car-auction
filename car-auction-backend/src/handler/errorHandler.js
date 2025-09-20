const errorHandler = (err, req, res, next) => {
  if (err.statusCode && err.success === false) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors || [],
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
  // For unexpected errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack,
    }),
  });
};
module.exports = { errorHandler };
