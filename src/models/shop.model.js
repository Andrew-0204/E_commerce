'use strict'

// !dmbg
const { model, Schema, Types } = require('mongoose')
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'


// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        defaul: 'inactive'
    },
    verfify:{
        type:Schema.Types.Boolean,
        defaul: false
    },
    roles:{
        type:Array,
        defaul: []
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
}
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);