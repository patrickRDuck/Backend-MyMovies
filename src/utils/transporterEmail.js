const Nodemailer = require("nodemailer")
require('dotenv').config()

const transportEmail = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mymovies.nortifications@gmail.com",
        pass: process.env.GMAIL_PASS
    }
})

module.exports = {transportEmail}