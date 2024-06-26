const AppError = require("../utils/AppError")
const sqliteConnection = require('../database/sqlite/index.js')
const bcrypt = require('bcrypt')
const {transportEmail} = require("../utils/transporterEmail.js")
const UserRepository = require("../repositories/UserRespository.js")

class UsersController {
    async create(request, response) {
        const {name, email, password} = request.body 

        const userRepository = new UserRepository()
        
        const verifyUser = await userRepository.findByEmail(email)

        if(verifyUser) {
            throw new AppError('Este Email já está em uso')
        }
        
        const hashedPassword = await bcrypt.hash(password, 8)

        await userRepository.create({name, email, password: hashedPassword})

        response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password} = request.body
        const { id } = request.user

        console.log({
            name,
            email,
            old_password,
            password,
            id
        })

        const database = await sqliteConnection()

        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
        
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

        transportEmail.sendMail({
            from: "MyMovies.nortifications@gmail.com",
            to: String(user.email),
            subject: "Atualização de dados na conta",
            text: "A sua conta na plataforma MyMovies foi atualizada! Caso não tenha sido feita por você entre em contato com o suporte"
        }, (error, info) => {
            if(error) {
                console.error(error)
            } else {
                console.log(`E-mail envaido com sucesso: ${info.response}`)
            }
        })
        
        return response.json()
    }
}

module.exports = UsersController