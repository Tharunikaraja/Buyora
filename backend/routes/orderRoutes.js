const express = require('express');
const { createOrderFromCart, getOrders, getOrderById } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/create', createOrderFromCart);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);

module.exports = router;
