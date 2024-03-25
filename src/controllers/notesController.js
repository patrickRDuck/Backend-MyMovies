const knex = require('../database/knex/index.js')
const AppError = require('../utils/AppError.js')

class notesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const { id: user_id } = request.user

        const [ note_id ] = await knex('movie_notes').insert({
            title,
            description,
            rating, 
            user_id
        })

        const tagsInsert = tags.map( name => {
            return {
                name, 
                user_id,
                note_id
            }
        })

        await knex('movie_tags').insert(tagsInsert)

        response.json()
    }

    async delete(request, response) {
        const { note_id } = request.params

        await knex('movie_notes').where({id: note_id}).delete()

        response.json()
    }

    async show(request, response) {
        const { note_id } = request.params

        const note = await knex('movie_notes').where({id: note_id}).first()
        const tags = await knex('movie_tags').where({note_id}).orderBy('name')

        return response.json({
            ...note,
            tags
        })
    }

    async index(request, response) {
        const { tags, title } = request.query
        const user_id = request.user.id

        let notes

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())

            notes = await knex('movie_tags')
            .select(['movie_notes.id', 'movie_notes.title', 'movie_notes.user_id'])
            .where('movie_notes.user_id', user_id)
            .whereLike('movie_notes.title', `%${title}%`)
            .whereIn('movie_tags.name', filterTags)
            .join('movie_notes', 'movie_tags.user_id', 'movie_notes.user_id')
            .orderBy('title')
        } else {
            if(title) {
                notes = await knex('movie_notes')
                .where({user_id})
                .whereLike('title', `%${title}%`)
                .orderBy('title')
            } else {
                notes = await knex('movie_notes')
                .where({user_id})
                .orderBy('id', 'desc')
            }
        }

        const userTags = await knex('movie_tags').where({user_id})
        const notesWithTags = notes.map( note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        })

        response.json(notesWithTags)
    }
}

module.exports = notesController