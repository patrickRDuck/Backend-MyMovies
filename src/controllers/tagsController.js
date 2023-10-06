const knex = require('../database/knex/index.js')

class TagsController {
    async index(request, response) {
        const { note_id } = request.params

        const tags = await knex('movie_tags').where({note_id})

        response.json(tags)
    }
}

module.exports = TagsController