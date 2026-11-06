const { getInventorySummary, getMarketTwinMatches } = require('../services/productService');

const storeInfo = (req, res) => {
  return res.json({
    success: true,
    store: {
      storeName: 'BUYVERSE',
      storeId: 'BUYVERSE-01',
      description: 'A universe of everything marketplace for electronics, fashion, home, beauty, wellness and lifestyle shopping.',
      supportedCategories: ['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty', 'Health & Wellness', 'Sports & Outdoors', 'Books & Media', 'Everyday Essentials'],
      currency: 'INR',
      apiVersion: 'v1',
    },
  });
};

const searchProducts = (req, res) => {
  const filters = req.body || {};
  const products = getMarketTwinMatches(filters);
  return res.json({
    success: true,
    store: 'BUYVERSE',
    storeId: 'BUYVERSE-01',
    totalResults: products.length,
    products,
  });
};

const inventorySummary = (req, res) => {
  return res.json({
    success: true,
    store: 'BUYVERSE',
    storeId: 'BUYVERSE-01',
    inventory: getInventorySummary(),
  });
};

const createOrder = (req, res) => {
  const { productId, quantity = 1, customerName, email } = req.body;
  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  const detail = getMarketTwinMatches({ category: undefined }).find((product) => product.productId === productId);
  if (!detail) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (detail.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock availability.' });
  }

  const order = {
    id: `MT-${Date.now()}`,
    storeId: 'BUYVERSE-01',
    customerName: customerName || 'MarketTwin Customer',
    email: email || 'customer@example.com',
    productId: detail.productId,
    productName: detail.name,
    quantity,
    price: detail.price,
    currency: detail.currency,
    totalAmount: detail.price * quantity,
    paymentStatus: 'CREATED',
    createdAt: new Date().toISOString(),
  };

  if (!req.app.locals.markettwinOrders) req.app.locals.markettwinOrders = [];
  req.app.locals.markettwinOrders.push(order);

  return res.status(201).json({ success: true, order });
};

const listOrders = (req, res) => {
  return res.json({
    success: true,
    store: 'BUYVERSE',
    storeId: 'BUYVERSE-01',
    orders: req.app.locals.markettwinOrders || [],
  });
};

module.exports = {
  storeInfo,
  searchProducts,
  inventorySummary,
  createOrder,
  listOrders,
};
