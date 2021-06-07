const {Strategy} = require('passport-local')
const passport = require('passport')
const {Pool} = require('pg')
const pool = new Pool(require('../../credentials'))
const bcrypt = require('bcrypt')
const faker = require('faker')

const authFields = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}

passport.use(
  'login',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        first_name TEXT,
        last_name TEXT
      );`)

      const {rows} = await pool.query('select * from users where email like $1', [email])
      if (!rows.length) {
        return cb(null, false, {message: 'Incorrect email or password.'})
      }
      const user = rows[0]

      const checkPassword = await compare(password, user.password)

      if (!checkPassword) {
        return cb(null, false, {message: 'Incorrect email or password.'})
      }
      return cb(null, user, {message: 'Logged In Successfully'})
    } catch (err) {
      return cb(null, false, {statusCode: 400, message: err.message})
    }
  })
)

passport.use(
  'signup',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        first_name TEXT,
        last_name TEXT
      );`)

      const {first_name, last_name} = req.body
      if (!first_name || !last_name) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Missing data',
        })
      }
      const {rows} = await pool.query('select * from users where email like $1', [email])

      if (rows.length) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Email already registered, log in instead',
        })
      }

      const now = new Date()
      const hashed = await hashPassword(password)
      const id = faker.datatype.uuid()

      const res = await pool.query(
        'insert into users (id, created_at, email, password, first_name, last_name) values ($1, $2, $3, $4, $5, $6) returning *',
        [id, now, email, hashed, first_name, last_name]
      )
      const user = res.rows[0]
      return cb(null, user)
    } catch (err) {
      return cb(null, false, {statusCode: 400, message: err.message})
    }
  })
)

const hashPassword = password => bcrypt.hash(password, 10)
const compare = (password, hashValue) => bcrypt.compare(password, hashValue)
