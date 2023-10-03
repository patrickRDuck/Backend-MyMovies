const createUser = require('./createUsers.js')
const sqliteConnection = require('../../sqlite/index.js')


async function migrationRun() {
    const schemas = [
        createUser
    ]

    sqliteConnection()
    .then(db => {
        schemas.forEach(schema => db.exec(schema))
    })
    .catch(error => console.error(error))
}

module.exports = migrationRun