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
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()
// init routes
// app.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Welcome Fantipjs!'
//     })
// })
// handling error
app.use('/', require('./routes'))

module.exports = app
// pollsize là gì? 