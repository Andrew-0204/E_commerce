'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/auth.Utils');

// authentication
router.use(authenticationV2);

// logout
router.post('', asyncHandler(productController.createProduct));


module.exports = router;
