'use strict'

const AccessService = require("../services/access.service")
const { OK, CREATED } = require('../core/success.response')

class AccessCoontroller {

    signUp = async( req, res, next ) => {

        // return res.status(200).json({
        //     message: '',
        //     metadata:
        // })
        const metadata = await AccessService.signUp(req.body);

            new CREATED({
                message: 'Registered OK!',
                metadata: metadata,
                options: {
                    limit: 10
                }
            }).send(res);
        // return res.status(201).json(await AccessService.signUp(req.body))
    }
}

module.exports = new AccessCoontroller()