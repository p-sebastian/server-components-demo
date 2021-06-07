const catchAsync = fn => async (request, response, next) => {
  try {
    await fn(request, response, next)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  catchAsync,
}
