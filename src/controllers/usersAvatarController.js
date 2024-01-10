const DiskStorage = require('../providers/diskStorage.js')
const knex = require('../database/knex/index.js')
const AppError = require('../utils/AppError.js')

class UserAvatarController {
    async update(request, response) {
        const id = request.user.id
        const avatarFilename = request.file.filename

        const diskStorage = new DiskStorage()

        const user = await knex('users').where({id}).first()

        if(!user) {
            throw new AppError("Somente usuários autenticados podem modificar o avatar")
        } 

        if(user.avatar) {
            await diskStorage.deleteFile(user.avatar)
        }

        const filename = await diskStorage.saveFile(avatarFilename)
        user.avatar = filename

        await knex('users').update({ avatar: avatarFilename}).where({id})

        return response.json(user)
    }
}

module.exports = UserAvatarController