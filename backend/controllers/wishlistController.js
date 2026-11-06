const getWishlist = (req, res) => {
  const userId = req.user.id;
  if (!req.app.locals.wishlists) req.app.locals.wishlists = {};
  if (!req.app.locals.wishlists[userId]) req.app.locals.wishlists[userId] = [];
  return res.json({ success: true, items: req.app.locals.wishlists[userId] });
};

const addItem = (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  if (!req.app.locals.wishlists) req.app.locals.wishlists = {};
  const wishlist = req.app.locals.wishlists[userId] || [];
  if (!wishlist.some((item) => item.productId === productId)) {
    wishlist.push({ productId, addedAt: new Date().toISOString() });
  }
  req.app.locals.wishlists[userId] = wishlist;
  return res.status(201).json({ success: true, items: wishlist });
};

const removeItem = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const wishlist = req.app.locals.wishlists?.[userId] || [];
  req.app.locals.wishlists[userId] = wishlist.filter((item) => item.productId !== productId);
  return res.json({ success: true, items: req.app.locals.wishlists[userId] });
};

module.exports = { getWishlist, addItem, removeItem };
