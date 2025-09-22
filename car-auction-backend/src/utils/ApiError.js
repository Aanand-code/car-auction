class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.error = errors; // matches your errorHandler
    this.data = null; // optional

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // fixed typo
    }
  }
}

module.exports = { ApiError };
