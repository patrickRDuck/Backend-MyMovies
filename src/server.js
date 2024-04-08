require('express-async-errors')
const express = require('express')
const AppError = require('./utils/AppError.js')
const routes = require('./routes/index.js')
const migrationRun = require('./database/sqlite/migrations/index.js')
const cors = require('cors')
const UPLOADCONFIG = require('./configs/upload.js')
require('dotenv').config()

migrationRun()

const app = express()
app.use(cors({
    origin: "https://moviesmy.netlify.app"
}))
app.use(express.json())

app.use('/files', express.static(UPLOADCONFIG.UPLOADS_FOLDER))
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

const PORT = parseInt(process.env.PORT)
app.listen(PORT, console.log(`Server is running on port ${PORT}`))
