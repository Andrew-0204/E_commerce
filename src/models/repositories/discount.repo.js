'use strict'

const {
    getSelectData, unGetSelectData
} = require('../../utlis')
 
const findAllDiscountCodeUnSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return products 
}

const findAllDiscountCodeSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products 
}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    checkDiscountExists,
    findAllDiscountCodeSelect
}