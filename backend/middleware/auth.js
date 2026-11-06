const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Administrator access required.' });
  }
  return next();
};

const requireMarketTwinKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['x-markettwinkey'];
  const { MARKETTWIN_API_KEY } = require('../config/env');

  if (!apiKey || apiKey !== MARKETTWIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid MarketTwin API key.' });
  }

  return next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireMarketTwinKey,
};
