'use strict'
// Nhiệm vụ lưu lại user, userId, puvlickey, refresh token 
const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    privateKey:{
        type:String,
        required:true
    },
    publicKey:{
        type:String,
        required:true
    },
    refreshTokensUsed:{
        // detect hacker sử dụng trái phép token
        type:Array,
        default: [] // những RF token đã được sử dụng
    },
    refreshToken:{
        type: String, required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);