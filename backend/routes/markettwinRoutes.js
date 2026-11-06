const express = require('express');
const { storeInfo, searchProducts, inventorySummary, createOrder, listOrders } = require('../controllers/markettwinController');
const { requireMarketTwinKey } = require('../middleware/auth');

const router = express.Router();

router.get('/store', storeInfo);
router.post('/search', requireMarketTwinKey, searchProducts);
router.get('/inventory', requireMarketTwinKey, inventorySummary);
router.post('/orders', requireMarketTwinKey, createOrder);
router.get('/orders', requireMarketTwinKey, listOrders);

module.exports = router;
