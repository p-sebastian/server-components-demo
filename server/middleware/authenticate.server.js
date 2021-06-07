const {passport} = require('../passport/jwt.server')

module.exports = {
  authenticate: (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        throw new Error(401, 'invalid token, please log in or sign up')
      }
      return next()
    })(req, res, next)
  },
}
