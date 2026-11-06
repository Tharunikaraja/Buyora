const { getAllProducts: getAllCatalogProducts, getInventorySummary } = require('../services/productService');

const getDashboardStats = async (req, res) => {
  const products = await getAllCatalogProducts();
  const orders = req.app.locals.orders || [];
  const users = req.app.locals.users || [];
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter((order) => ['Placed', 'Confirmed', 'Processing', 'Shipped'].includes(order.status)).length;
  const lowStock = products.filter((product) => product.stock < 10);

  return res.json({
    success: true,
    stats: {
      totalProducts: products.length,
      totalCustomers: users.filter((user) => user.role === 'customer').length,
      totalOrders: orders.length,
      totalRevenue: revenue,
      pendingOrders,
      lowStockProducts: lowStock.length,
    },
  });
};

const listAllProducts = async (req, res) => {
  const products = await getAllCatalogProducts();
  return res.json({ success: true, products });
};

const addProduct = (req, res) => {
  const product = {
    productId: req.body.productId || `TECH${Date.now()}`,
    name: req.body.name,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    price: Number(req.body.price),
    discountPrice: Number(req.body.discountPrice || req.body.price),
    images: req.body.images || ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'],
    specifications: req.body.specifications || {},
    stock: Number(req.body.stock || 0),
    deliveryDays: Number(req.body.deliveryDays || 3),
    rating: Number(req.body.rating || 4.5),
    reviews: Number(req.body.reviews || 0),
    featured: Boolean(req.body.featured),
    bestSeller: Boolean(req.body.bestSeller),
  };

  if (!req.app.locals.products) req.app.locals.products = getAllCatalogProducts();
  req.app.locals.products.unshift(product);
  return res.status(201).json({ success: true, product });
};

const updateProduct = (req, res) => {
  const { productId } = req.params;
  const products = req.app.locals.products || getAllCatalogProducts();
  const index = products.findIndex((item) => item.productId === productId);
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found.' });

  products[index] = { ...products[index], ...req.body };
  req.app.locals.products = products;
  return res.json({ success: true, product: products[index] });
};

const deleteProduct = (req, res) => {
  const { productId } = req.params;
  const products = req.app.locals.products || getAllCatalogProducts();
  const filtered = products.filter((item) => item.productId !== productId);
  req.app.locals.products = filtered;
  return res.json({ success: true, message: 'Product deleted.' });
};

const getOrders = (req, res) => {
  return res.json({ success: true, orders: req.app.locals.orders || [] });
};

const updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const orders = req.app.locals.orders || [];
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  order.status = status;
  return res.json({ success: true, order });
};

const getCustomers = (req, res) => {
  const users = req.app.locals.users || [];
  return res.json({ success: true, customers: users.filter((user) => user.role === 'customer') });
};

const getInventory = (req, res) => {
  return res.json({ success: true, inventory: getInventorySummary() });
};

module.exports = {
  getDashboardStats,
  listAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getCustomers,
  getInventory,
};
