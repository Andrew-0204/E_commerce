'use strict'



const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const { findById } = require("../services/apikey.service")

const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key){
            return res.json({
                message: 'Forbiden Error'
            })
        }
        // check apiKey
        const objKey = await findById(key)
        if (!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {

    }
}

const permission = ( permission ) => {
    return (req, res, next) => {
        if (!req.objKey.permissions){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        console.log(`permissions::`, req.objKey.permissions)
        const valisPermission = req.objKey.permissions.includes(permission)
        if (!valisPermission){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}