'use strict'
// Viết hàm tạo token
// hướng về modul => Đóng gói modul và gọi lẫn nhau => Hướng module gần giống hướng đối tượng
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // const publicKeyString = publicKey.toString()
            const tokens = await keytokenModel.create({
                user: userId,
                // publicKey: publicKeyString
                publicKey,
                privateKey
            })
            return tokens ? tokens.publicKey : null
        } catch(error){
            return error
        }
    }
}

module.exports = KeyTokenService