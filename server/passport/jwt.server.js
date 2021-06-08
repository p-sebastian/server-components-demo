const passport = require('passport')
const {ExtractJwt, Strategy} = require('passport-jwt')
const {Pool} = require('pg')
const pool = new Pool(require('../../credentials'))
const jwt = require('jsonwebtoken')

const jwtPublicSecret = process.env.JWT_PUBLIC_SECRET.replace(/\\n/g, '\n')
const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n')

const cookieExtractor = req => {
  let token = null
  if (req && req.cookies.jwt) {
    token = req.cookies.jwt
  }

  return token
}

const options = {
  secretOrKey: jwtPublicSecret,
  algorithms: ['RS256'],
  passReqToCallback: true,
}

options.jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  req => cookieExtractor(req),
])

passport.use(
  new Strategy(options, (req, jwtPayload, done) => {
    pool
      .query('select * from users where id = $1', [jwtPayload.id])
      .then(({rows}) => {
        if (!rows.length) {
          return done('not found', false)
        }
        done(null, rows[0])
      })
      .catch(e => done(e, false))
  })
)

const generateVerificationToken = id =>
  jwt.sign({id}, jwtPrivateSecret, {
    expiresIn: '10d',
    algorithm: 'RS256',
  })

module.exports = {
  passport,
  generateVerificationToken,
}
