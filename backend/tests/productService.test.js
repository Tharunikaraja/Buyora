const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const { normalizeProductRecord, getAllProducts } = require('../services/productService');

test('normalizeProductRecord maps Supabase snake_case rows to the app format', () => {
  const product = normalizeProductRecord({
    product_id: 'TECH999',
    name: 'Demo Laptop',
    brand: 'TechCo',
    category: 'Laptops',
    description: 'Great laptop',
    price: 49999,
    discount_price: 42999,
    images: ['a.jpg', 'b.jpg'],
    specifications: { display: '15.6-inch' },
    stock: 12,
    delivery_days: 4,
    rating: 4.7,
    reviews: 100,
    featured: true,
    best_seller: true,
  });

  assert.equal(product.productId, 'TECH999');
  assert.equal(product.discountPrice, 42999);
  assert.equal(product.deliveryDays, 4);
  assert.equal(product.bestSeller, true);
  assert.deepEqual(product.images, ['a.jpg', 'b.jpg']);
});

test('getAllProducts returns an empty list when no database is configured', async () => {
  const db = require('../config/db');
  const originalSupabase = db.supabase;
  const originalConfigured = db.isConfigured;

  db.supabase = null;
  db.isConfigured = false;
  delete require.cache[require.resolve('../services/productService')];

  const { getAllProducts: getAllProductsWithoutDb } = require('../services/productService');
  const products = await getAllProductsWithoutDb();

  db.supabase = originalSupabase;
  db.isConfigured = originalConfigured;
  delete require.cache[require.resolve('../services/productService')];

  assert.ok(Array.isArray(products));
  assert.equal(products.length, 0);
});

test('addItem adds a valid product to user cart when product lookup is async', async () => {
  const originalLoad = Module._load;
  const stubbedProductService = {
    getProductById: async () => ({
      productId: 'TECH123',
      name: 'Demo Product',
      stock: 5,
      discountPrice: 1000,
      price: 1200,
      images: ['demo.jpg'],
    }),
  };

  Module._load = function (request, parent, isMain) {
    if (request === '../services/productService') {
      return stubbedProductService;
    }
    return originalLoad.apply(this, arguments);
  };

  delete require.cache[require.resolve('../controllers/cartController')];
  const cartController = require('../controllers/cartController');

  const req = {
    user: { id: 'user-1' },
    body: { productId: 'TECH123', quantity: 1 },
    app: { locals: {} },
  };

  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };

  await cartController.addItem(req, res);
  Module._load = originalLoad;
  delete require.cache[require.resolve('../controllers/cartController')];

  assert.equal(res.statusCode, 201);
  assert.equal(req.app.locals.carts['user-1'][0].productId, 'TECH123');
  assert.equal(req.app.locals.carts['user-1'][0].quantity, 1);
});
