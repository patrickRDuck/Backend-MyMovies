const AppError = require("../utils/AppError")
const knex = require('../database/knex/index.js')
const sqliteConnection = require('../database/sqlite/index.js')
const bcrypt = require('bcrypt')

class UsersController {
    async create(request, response) {
        const {name, email, password} = request.body 

        const database = await sqliteConnection()
        
        const verifyUser = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if(verifyUser) {
            throw new AppError('Este Email já está em uso')
        }
        
        const hashedPassword = await bcrypt.hash(password, 8)

        await knex('users').insert({
            name,
            email,
            password: hashedPassword
        })

        response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password} = request.body
        const { id } = request.user

        const database = await sqliteConnection()

        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
        console.log(user)
        if(!user) {
            throw new AppError('Usuário não encontrado')
        }

        const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])
        if(userWithUpdatedEmail && userWithUpdatedEmail.email !== user.email) {
            throw new AppError('Este Email já está em uso')
        }

        user.email = email ?? user.email
        user.name = name ?? user.name

        if(password && !old_password) {
            throw new AppError('É preciso informar a senha antiga para fazer a alteração')
        }

        if(password && old_password) {
            const checkedPassowrd = await bcrypt.compare(old_password, user.password)

            if(!checkedPassowrd) {
                throw new AppError('A senha anitga não confere')
            }

            user.password = await bcrypt.hash(password, 8)
        }

        database.run(`
            UPDATE users SET
            name = (?),
            email = (?),
            password = (?),
            updated_at = DATETIME('now')
            WHERE ID = (?)
        `, [user.name, user.email, user.password, id])
        
        return response.json()
    }
}

module.exports = UsersController