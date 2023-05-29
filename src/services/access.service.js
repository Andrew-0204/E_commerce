'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/auth.Utils")
const { getInfoData } = require("../utlis")
const { BadRequestError, ConflictResquestError, AuthFailureError } = require("../core/error.response")

// service // 
const { findByEmail } = require("./shop.service")
const { threadId } = require("node:worker_threads")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
        1 - Check email in dbs
        2 - match password
        3 - create AT vs RT and save
        4 - general tokens
        5 - get data return login 
    */
    static login = async( {email, password, refreshToken = null}) => {
        // 1.
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Shop not registered!')
        // 2.
        const match = bcrypt.compare( password, foundShop.password )
        if (!match) throw new AuthFailureError('Authentication error')
        // 3. 
        // Created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // 4. 
        const tokens = await createTokenPair({ userId: foundShop._id, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id
        })
        return {
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }
    }

    static signUp = async ({ name, email, password }) => {

            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop){
                throw new BadRequestError('Error: Shop already registered!')
            }
            const passwordHash = await bcrypt.hash(password, 10) // dò dỉ database -> không biết password là gì
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop){
                // Created privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                // Public key CryptoGraphy Standards! 
                console.log({privateKey, publicKey}) // save collection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore){
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }

                const tokens = await createTokenPair({ userId: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success:', tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 201,
                metadata: null
            }
    }

}

module.exports = AccessService