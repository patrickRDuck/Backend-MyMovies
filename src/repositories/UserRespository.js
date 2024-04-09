const sqliteConnection = require('../database/sqlite/index.js')
const knex = require('../database/knex/index.js')

class UserRepository {
    async findByEmail(email) {
        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    
        return user
    }

    async create({name, email, password}) {
        const userId = await knex('users').insert({
            name,
            email,
            password: password
        })

        return {id: userId}
    }
}