'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/auth.Utils');
const inventoryController = require('../../controllers/inventory.controller');

router.use(authenticationV2)
router.post('', asyncHandler(inventoryController.addStockToInventory))


module.exports = router;
