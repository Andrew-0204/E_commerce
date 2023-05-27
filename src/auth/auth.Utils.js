'use strict'

const JWT = require('jsonwebtoken')

// publicKey lấy từ mongodb => chuyển sang hashstring rồi lưu vào mongodb
// privateKey không lưu vào database

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // accessToken
        // privateKey => signup sẽ đẩy sang brower
        // payload chứa các thông tin vận chuyển từ site này site khác
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })
        // verify su dung publictoken
        // Bình thường chỉ sử dụng privateKey để vừa sign vửa verify => họ có thể verify chữ ký của chúng ta, tạo ra chữ ký của chúng ta luôn
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if (err){
                console.error(`error verify::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch(error) {

    }
}

module.exports = {
    createTokenPair
}