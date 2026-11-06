const express = require('express');
const { listProducts, getProduct, getProductsByCategoryRoute, searchProductsRoute } = require('../controllers/productController');

const router = express.Router();

router.get('/', listProducts);
router.get('/search', searchProductsRoute);
router.get('/category/:category', getProductsByCategoryRoute);
router.get('/:productId', getProduct);

module.exports = router;
