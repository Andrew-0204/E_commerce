'use strict'
// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27018,
//         name: 'shopDEV'
//     }
// }
// level 01
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27018,
        name: process.env.DEV_DB_NAME || 'shopDEV'
    }
}
const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27018,
        name: process.env.PRO_DB_NAME || 'shopPRO'
    }
}
const config = { dev, pro }
const env = process.env.NODE_DEV || 'dev'
module.exports = config['dev']