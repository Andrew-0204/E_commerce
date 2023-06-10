'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/auth.Utils');


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// authentication
router.use(authenticationV2);

// logout
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

/// QUERY ///
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop ))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop ))



module.exports = router;
