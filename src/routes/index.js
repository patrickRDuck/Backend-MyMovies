const usersRoutes = require('./users.routes.js')
const { Router } = require('express')

const routes = Router()

routes.use('/users', usersRoutes)

module.exports = routes
