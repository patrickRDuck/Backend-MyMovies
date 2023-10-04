const Knex = require('knex')
const config = require('../../../knexfile.js')

const knex = Knex(config.development)

module.exports = knex