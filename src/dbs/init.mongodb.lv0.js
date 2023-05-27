'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb+srv://ecommerce:ecommerce@ecommerce.zugoutb.mongodb.net/shopDEV`;
// const connectString = `mongodb://localhost:8082/shopDEV`
mongoose.connect(connectString).then(_ => console.log('Connected Mongodb Success'))
    .catch(err => console.log('Error Connect!'));

if (1 == 0){
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true})
}

module.exports = mongoose
