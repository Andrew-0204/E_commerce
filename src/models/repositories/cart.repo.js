'use strict'

const { convertToObjectIdMongodb } = require('../../utlis')
const { cart } = require('../cart.model')

const findCartById = async (cartId) => {
    return await cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean()
}

module.exports = {
    findCartById
}