const AppError = require("../utils/AppError")

class UsersController {
    create(request, response) {
        const {name, email, password, old_password} = request.body 
        

        response.send('usuário criado')
    }
}

module.exports = UsersController