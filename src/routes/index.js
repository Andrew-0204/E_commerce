'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// check apikey: check key mang theo có hợp lệ với api của chúng ta không
router.use(apiKey)
// check permission: Khi đã hợp lệ thì check quyền truy cập
router.use(permission('0000'))

router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))


module.exports = router