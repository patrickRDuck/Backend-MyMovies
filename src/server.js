require('express-async-errors')
const express = require('express')
const AppError = require('./utils/AppError.js')
const routes = require('./routes/index.js')
const migrationRun = require('./database/sqlite/migrations/index.js')

migrationRun()

const app = express()
app.use(express.json())

app.use(routes)

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.status).json({
            message: error.message,
            status: error.status
        })
    }

    console.error(error)

    return response.status(500).json({
        status: 'Error',
        message: 'internal Server Error'
    })
})

const PORT = 3333
app.listen(PORT, console.log(`Server is running on port ${PORT}`))
