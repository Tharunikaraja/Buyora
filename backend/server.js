const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { PORT, FRONTEND_ORIGIN, MARKETTWIN_ORIGIN } = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const marketTwinRoutes = require('./routes/markettwinRoutes');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'BUYORA Backend is Running!',
    status: 'Success',
  });
});

app.locals.products = [];
app.locals.users = [
  {
    id: 'ADMIN-1',
    fullName: 'BUYVERSE Admin',
    email: 'admin@buyverse.com',
    phone: '9999999999',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];
app.locals.carts = {};
app.locals.wishlists = {};
app.locals.orders = [];
app.locals.markettwinOrders = [];

const rateLimiter = new RateLimiterMemory({ points: 120, duration: 60 });

app.use(cors({
  origin: [FRONTEND_ORIGIN, MARKETTWIN_ORIGIN, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' }));
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BUYVERSE backend is running.', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/markettwin', marketTwinRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BUYVERSE backend running at http://0.0.0.0:${PORT}`);
});
