'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const keytokenModel = require('../models/keytoken.model');
const { createTokenPair, verifyJWT } = require("../auth/auth.Utils")
const { getInfoData } = require("../utlis")
const { BadRequestError, ConflictResquestError, AuthFailureError, ForbiddenError } = require("../core/error.response")

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
        check this token used?
    */

    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;
        
        if (keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened! Please relogin');
        }
            
        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not registered');
        }
    
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new AuthFailureError('Shop not registered');
        }
        
        // Create a new refresh token
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );
    
        // Update the keyStore with the new refresh token
        await keytokenModel.findOneAndUpdate(
            { _id: keyStore._id },
            {
                refreshToken: tokens.refreshToken,
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            }
        );
        
        return {
            user,
            tokens
        };
    }    
        

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    }

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
        const {_id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
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