/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'

require('dotenv').config()
const register = require('react-server-dom-webpack/node-register')
register()
const babelRegister = require('@babel/register')
const faker = require('faker')
const passport = require('passport')
const cookieParser = require('cookie-parser')

babelRegister({
  ignore: [/[\\\/](build|server|node_modules)[\\\/]/],
  presets: [['react-app', {runtime: 'automatic'}]],
  plugins: ['@babel/transform-modules-commonjs'],
})

const express = require('express')
const compress = require('compression')
const {readFileSync} = require('fs')
const {unlink, writeFile} = require('fs').promises
const {pipeToNodeWritable} = require('react-server-dom-webpack/writer')
const path = require('path')
const {Pool} = require('pg')
const React = require('react')
const logger = require('morgan')
const ReactApp = require('../src/App.server').default
const {db, pgp} = require('./database.server')
const authRoutes = require('./routes/auth.route.server')
const {errorHandler} = require('./error.server')

// Don't keep credentials in the source tree in a real app!
const pool = new Pool(require('../credentials'))

const PORT = process.env.PORT || 4000
const app = express()

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  app.use(logger('dev'))
}
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app
  .listen(PORT, () => {
    console.log(`React Notes listening at ${PORT}...`)
  })
  .on('error', function(error) {
    if (error.syscall !== 'listen') {
      throw error
    }
    const isPipe = portOrPipe => Number.isNaN(portOrPipe)
    const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  })

function handleErrors(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res)
    } catch (x) {
      next(x)
    }
  }
}

passport.initialize()
app.use('/auth', authRoutes)

app.get(
  '/',
  handleErrors(async function(_req, res) {
    await waitForWebpack()
    const html = readFileSync(path.resolve(__dirname, '../build/index.html'), 'utf8')
    // Note: this is sending an empty HTML shell, like a client-side-only app.
    // However, the intended solution (which isn't built out yet) is to read
    // from the Server endpoint and turn its response into an HTML stream.
    res.send(html)
  })
)

async function renderReactTree(res, props) {
  await waitForWebpack()
  const manifest = readFileSync(path.resolve(__dirname, '../build/react-client-manifest.json'), 'utf8')
  const moduleMap = JSON.parse(manifest)
  pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap)
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location) || {}
  const {searchText, token, signUp, email, password, user = {}} = location
  console.info(location)
  if (redirectToId) {
    location.selectedId = redirectToId
  }
  // allows navigation
  res.set('X-Location', JSON.stringify(location))
  renderReactTree(res, {
    searchText,
    token,
    // signIn = true; signUp = false
    signUp,
    email,
    password,
    user,
  })
}

app.get('/react', function(req, res) {
  sendResponse(req, res, null)
})

const NOTES_PATH = path.resolve(__dirname, '../notes')

const cs = new pgp.helpers.ColumnSet(['id', 'image', 'name', 'price', 'description', 'created_at'], {table: 'products'})
app.post(
  '/seed',
  handleErrors(async (req, res) => {
    await pool.query('DROP TABLE IF EXISTS products;')
    await pool.query(`CREATE TABLE products (
      id UUID PRIMARY KEY,
      created_at TIMESTAMP NOT NULL,
      image TEXT,
      name TEXT,
      price TEXT,
      description TEXT
    );`)

    const a = Array.from({length: 50}, (_, i) => i + 1)
    const products = a.map(() => ({
      id: faker.datatype.uuid(),
      image: faker.image.fashion(100, 100),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      created_at: new Date(),
    }))

    const query = pgp.helpers.insert(products, cs)
    await db.none(query)
    res.json({body: 'end'})
    // sendResponse(req, res, null)
  })
)

app.get(
  '/products',
  handleErrors(async function(req, res) {
    const searchText = req.query.searchText || ''
    console.info(req.query)
    const {rows} = await pool.query('select * from products where name like $1 order by created_at desc', [
      `%${searchText}%`,
    ])
    res.json(rows)
  })
)

app.post(
  '/notes',
  handleErrors(async function(req, res) {
    const now = new Date()
    const result = await pool.query(
      'insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id',
      [req.body.title, req.body.body, now]
    )
    const insertedId = result.rows[0].id
    await writeFile(path.resolve(NOTES_PATH, `${insertedId}.md`), req.body.body, 'utf8')
    sendResponse(req, res, insertedId)
  })
)

app.put(
  '/notes/:id',
  handleErrors(async function(req, res) {
    const now = new Date()
    const updatedId = Number(req.params.id)
    await pool.query('update notes set title = $1, body = $2, updated_at = $3 where id = $4', [
      req.body.title,
      req.body.body,
      now,
      updatedId,
    ])
    await writeFile(path.resolve(NOTES_PATH, `${updatedId}.md`), req.body.body, 'utf8')
    sendResponse(req, res, null)
  })
)

app.delete(
  '/notes/:id',
  handleErrors(async function(req, res) {
    await pool.query('delete from notes where id = $1', [req.params.id])
    await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`))
    sendResponse(req, res, null)
  })
)

app.get(
  '/notes',
  handleErrors(async function(_req, res) {
    const {rows} = await pool.query('select * from notes order by id desc')
    res.json(rows)
  })
)

app.get(
  '/notes/:id',
  handleErrors(async function(req, res) {
    const {rows} = await pool.query('select * from notes where id = $1', [req.params.id])
    res.json(rows[0])
  })
)

app.get('/sleep/:ms', function(req, res) {
  setTimeout(() => {
    res.json({ok: true})
  }, req.params.ms)
})

app.use(errorHandler)
app.use(express.static('build'))
app.use(express.static('public'))

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/index.html'))
      return
    } catch (err) {
      console.log('Could not find webpack build output. Will retry in a second...')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
