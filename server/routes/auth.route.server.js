const {Router} = require('express')
const authController = require('../controllers/auth.controller.server')
const {catchAsync} = require('../middleware/helpers.server')
const authentication = require('../middleware/authenticate.server')

const {signup, login, protectedRoute, logout} = authController
const {authenticate} = authentication

const authRouter = Router()

authRouter.post('/signup', catchAsync(signup))
authRouter.post('/login', catchAsync(login))
authRouter.get('/amiworthy', authenticate, catchAsync(protectedRoute))

module.exports = authRouter
