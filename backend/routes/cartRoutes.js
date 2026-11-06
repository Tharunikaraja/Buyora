const express = require('express');
const { getCart, addItem, updateQuantity, removeItem } = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', getCart);
router.post('/add', addItem);
router.put('/update', updateQuantity);
router.delete('/remove/:productId', removeItem);

module.exports = router;
