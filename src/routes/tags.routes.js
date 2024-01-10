const { Router } = require('express')
const TagsController = require('../controllers/tagsController')
const {  ensureAuthentication } = require('../middleware/ensureAuthentication.js')

const tagsController = new TagsController()
const tagsRoutes = Router()

tagsRoutes.get('/:note_id',  ensureAuthentication, tagsController.index)

module.exports = tagsRoutes