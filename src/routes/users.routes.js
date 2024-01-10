const { Router } = require('express')
const UsersController = require('../controllers/usersController.js')
const { ensureAuthentication } = require('../middleware/ensureAuthentication.js')
const multer = require('multer')
const { MULTER } = require('../configs/upload.js')
const UserAvatarController = require('../controllers/usersAvatarController.js')

const usersRoutes = Router()
const upload = multer( { storage: MULTER.storage } )

const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensureAuthentication, usersController.update)
usersRoutes.patch('/avatar', ensureAuthentication, upload.single('avatar'), userAvatarController.update)

module.exports = usersRoutes