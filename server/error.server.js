const {config} = require('dotenv')
const debug = require('debug')

config()

const DEBUG = debug('dev')

const errorHandler = (err, request, response, next) => {
  const isProduction = process.env.NODE_ENV === 'production'
  let errorMessage = {}

  if (response.headersSent) {
    return next(err)
  }

  if (!isProduction) {
    DEBUG(err.stack)
    errorMessage = err
  }

  return response.status(err.statusCode || 500).json({
    status: 'error',
    error: {
      message: err.message,
      ...(err.errors && {errors: err.errors}),
      ...(!isProduction && {trace: errorMessage}),
    },
  })
}

class ApplicationError extends Error {
  constructor(statusCode, message = 'an error occurred', errors) {
    super(message)
    this.statusCode = statusCode || 500
    this.message = message
    this.errors = errors
  }
}

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(404, message || 'resource not found')
  }
}

module.exports = {
  errorHandler,
  ApplicationError,
  NotFoundError,
}
