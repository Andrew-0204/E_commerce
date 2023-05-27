'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/auth.Utils")
const { getInfoData } = require("../utlis")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try{
            // step 1: check email exists??
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop){
                return {
                    code: 'xxxx',
                    message: 'Shop already resitered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10) // dò dỉ database -> không biết password là gì
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop){
                // created privateKey, publicKey xử dụng thuật toán bất đối xứng 
                // privatekey -> Để cho ngưởi dùng. publicKey -> Để trong hệ thống của chúng ta
                // privatekey -> sign token. publicKey -> vertify token
                // Giả sử hacker truy cập vào hệ thống của chúng ta sẽ lấy được publicKey => nhưng mà publicKey không có quyền sign token => không thể đăng nhập vòa tài khoản được
                // regis sau cho truy cập vào hệ thống luôn 
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     // rsa thuật toán của bất đối xứng
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // pkcs8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                //     // Public Key CryptoGraphy Standards 1
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

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
                // console.log(`publicKeyString::`, publicKeyString)
                // const publicKeyObject = crypto.createPublicKey( publicKeyString )
                // console.log(`publicKeyObject::`, publicKeyObject)
                // created token pair
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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

}

module.exports = AccessService