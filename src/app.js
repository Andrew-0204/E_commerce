require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()


// init middlewates
app.use(morgan("dev"))
// app.use(morgan("combined")) 
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))
app.use(helmet()) // hacker se tham do restapi cua minh dung cong nghe gi. Dung helmet de che phan nay lai
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// init db
require('./dbs/init.mongodb')

// init routes

app.use('/', require('./routes'))
// handling error
app.use(( req, res, next ) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
// ErrorHandler
app.use(( error, req, res, next ) => {
    const status = error.status || 500
    return res.status(status).json({
        status: 'error',
        code: status,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app
// pollsize là gì? 