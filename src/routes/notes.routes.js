const { Router } = require('express')
const NotesController = require('../controllers/notesController.js')

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.post('/:user_id', notesController.create)
notesRoutes.delete('/:note_id', notesController.delete)
notesRoutes.get('/:note_id', notesController.show)
notesRoutes.get('/', notesController.index)

module.exports = notesRoutes