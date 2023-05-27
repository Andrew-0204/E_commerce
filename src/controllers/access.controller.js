'use strict'

const AccessService = require("../services/access.service")

class AccessCoontroller {

    signUp = async( req, res, next ) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            /*  
                200 OK
                201 CREATED    

            */
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessCoontroller()