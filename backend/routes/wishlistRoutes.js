const express = require('express');
const { getWishlist, addItem, removeItem } = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', getWishlist);
router.post('/add', addItem);
router.delete('/remove/:productId', removeItem);

module.exports = router;
