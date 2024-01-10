const Knex = require("knex")
const config = require('../../configs/knexfile.js')

const knex = Knex(config.development)

module.exports = knex