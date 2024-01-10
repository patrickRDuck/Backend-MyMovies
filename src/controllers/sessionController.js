const jwt = require('jsonwebtoken')
const JWTCONFIG = require('../configs/authConfig.js')
const knex = require('../database/knex/index.js')
const AppError = require('../utils/AppError.js')
const bcrypt = require('bcrypt')

class SessionController {
    async create(request, response) {
        const { email, password } = request.body

        const user = await knex('users').where({email}).first()

        if(!user) {
            throw new AppError("E-mail e/ou senha incorreto(s)")
        }

        const passwordMatched = await bcrypt.compare(password, user.password)

        if(!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorreto(s)")
        }

        const { secret, expiresIn } = JWTCONFIG.jwt
        const token = jwt.sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({token, user})
    }
}

module.exports = { SessionController }