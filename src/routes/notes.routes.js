const { Router } = require('express')
const NotesController = require('../controllers/notesController.js')
const {ensureAuthentication} = require('../middleware/ensureAuthentication.js')

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.use(ensureAuthentication)

notesRoutes.post('/', notesController.create)
notesRoutes.delete('/:note_id', notesController.delete)
notesRoutes.get('/:note_id', notesController.show)
notesRoutes.get('/', notesController.index)

module.exports = notesRoutes