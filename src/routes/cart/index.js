'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/auth.Utils');
const cartController = require('../../controllers/cart.controller');

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

module.exports = router;
