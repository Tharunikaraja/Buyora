const express = require('express');
const { getDashboardStats, listAllProducts, addProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus, getCustomers, getInventory } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);
router.get('/stats', getDashboardStats);
router.get('/products', listAllProducts);
router.post('/products', addProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);
router.get('/orders', getOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/inventory', getInventory);

module.exports = router;
