const { getProductById } = require('../services/productService');

const getCart = (req, res) => {
  const userId = req.user.id;
  if (!req.app.locals.carts) req.app.locals.carts = {};
  if (!req.app.locals.carts[userId]) req.app.locals.carts[userId] = [];

  return res.json({ success: true, items: req.app.locals.carts[userId] });
};

const addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;
  if (!req.app.locals.carts) req.app.locals.carts = {};
  const cart = req.app.locals.carts[userId] || [];
  const product = await getProductById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (product.stock < Number(quantity)) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });
  }

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    const nextQty = existing.quantity + Number(quantity);
    if (nextQty > product.stock) {
      return res.status(400).json({ success: false, message: 'Cart quantity exceeds available stock.' });
    }
    existing.quantity = nextQty;
  } else {
    cart.push({ productId, quantity: Number(quantity), price: product.discountPrice || product.price, name: product.name, image: product.images?.[0] || '' });
  }

  req.app.locals.carts[userId] = cart;
  return res.status(201).json({ success: true, message: 'Item added to cart.', items: cart });
};

const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  const cart = req.app.locals.carts?.[userId] || [];
  const item = cart.find((entry) => entry.productId === productId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (Number(quantity) > product.stock) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });
  }

  item.quantity = Number(quantity);
  req.app.locals.carts[userId] = cart;
  return res.json({ success: true, items: cart });
};

const removeItem = (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const cart = req.app.locals.carts?.[userId] || [];
  req.app.locals.carts[userId] = cart.filter((entry) => entry.productId !== productId);
  return res.json({ success: true, items: req.app.locals.carts[userId] });
};

module.exports = { getCart, addItem, updateQuantity, removeItem };
