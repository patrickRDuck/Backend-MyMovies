const { Router } = require('express')
const TagsController = require('../controllers/tagsController')

const tagsController = new TagsController()
const tagsRoutes = Router()

tagsRoutes.get('/:note_id', tagsController.index)

module.exports = tagsRoutes