const usersRoutes = require('./users.routes.js')
const notesRoutes = require('./notes.routes.js')
const tagsRoutes = require('./tags.routes.js')
const { Router } = require('express')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)

module.exports = routes
