const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError.js')
const JWTCONFIG = require('../configs/authConfig.js')

function ensureAuthentication(request, response, next) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError("JWT token não informado", 401)
    }

    const [ , token] = authHeader.split(' ')

    try {
        const { sub: user_id} = jwt.verify(token, JWTCONFIG.jwt.secret)

        request.user = {
            id: Number(user_id)
        }

        return next()
    } catch {
        throw new AppError("JWT token inválido", 401)
    }
}

module.exports = { ensureAuthentication }