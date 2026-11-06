const { supabase, isConfigured } = require('../config/db');

const normalizeImageList = (value) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeImageList(item));
  }

  if (typeof value !== 'string') {
    return [];
  }

  const text = value.trim();
  if (!text || text === 'null' || text === 'None' || text === '[]') {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.flatMap((item) => normalizeImageList(item));
    }
    if (typeof parsed === 'string' && parsed.trim()) {
      return [parsed.trim()];
    }
  } catch (error) {
    // Ignore and treat as plain text below.
  }

  if (text.startsWith('[') && text.endsWith(']')) {
    return [text];
  }

  return [text];
};

const normalizeProductRecord = (product = {}) => {
  const raw = product || {};
  const images = normalizeImageList(raw.images || raw.image_urls || []);

  const specifications = raw.specifications && typeof raw.specifications === 'object'
    ? raw.specifications
    : {};

  const price = Number(raw.price || 0);
  const discountPrice = Number(raw.discount_price ?? raw.discountPrice ?? price);

  return {
    productId: raw.product_id || raw.productId || raw.id || `TECH${Date.now()}`,
    name: raw.name || 'Unnamed Product',
    brand: raw.brand || 'BUYVERSE',
    category: raw.category || 'General',
    description: raw.description || '',
    price,
    discountPrice,
    images,
    specifications,
    stock: Number(raw.stock || 0),
    deliveryDays: Number(raw.delivery_days ?? raw.deliveryDays ?? 3),
    rating: Number(raw.rating ?? 4.5),
    reviews: Number(raw.reviews || 0),
    featured: Boolean(raw.featured),
    bestSeller: Boolean(raw.best_seller ?? raw.bestSeller ?? false),
    categoryTag: raw.category_tag || raw.categoryTag || '',
  };
};

const fetchDbProducts = async () => {
  if (!isConfigured || !supabase) {
    console.warn('Supabase is not configured. Returning empty product list in database-only mode.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase product lookup failed. Returning empty list:', error.message);
      return [];
    }

    return (data || []).map(normalizeProductRecord);
  } catch (error) {
    console.warn('Supabase unavailability detected. Returning empty list:', error.message);
    return [];
  }
};

const getAllProducts = async () => {
  return fetchDbProducts();
};

const getProductById = async (productId) => {
  const products = await getAllProducts();
  return products.find((product) => product.productId === productId);
};

const searchProducts = async (query = '') => {
  const q = String(query || '').toLowerCase().trim();
  const products = await getAllProducts();

  if (!q) return products;

  return products.filter((product) => {
    const combined = [
      product.name,
      product.brand,
      product.category,
      product.description,
      JSON.stringify(product.specifications || {}),
    ].join(' ').toLowerCase();

    return combined.includes(q);
  });
};

const getProductsByCategory = async (category) => {
  const products = await getAllProducts();
  return products.filter((product) => product.category.toLowerCase() === String(category || '').toLowerCase());
};

const filterProducts = async ({ minPrice, maxPrice, brand, category, rating, stockAvailable, deliveryMax }) => {
  let filtered = await getAllProducts();

  if (minPrice) filtered = filtered.filter((product) => product.discountPrice >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((product) => product.discountPrice <= Number(maxPrice));
  if (brand) filtered = filtered.filter((product) => product.brand.toLowerCase() === String(brand).toLowerCase());
  if (category) filtered = filtered.filter((product) => product.category.toLowerCase() === String(category).toLowerCase());
  if (rating) filtered = filtered.filter((product) => product.rating >= Number(rating));
  if (stockAvailable) filtered = filtered.filter((product) => product.stock > 0);
  if (deliveryMax) filtered = filtered.filter((product) => product.deliveryDays <= Number(deliveryMax));

  return filtered;
};

const getInventorySummary = async () => {
  const products = await getAllProducts();
  return products.map((product) => ({
    productId: product.productId,
    stock: product.stock,
    available: product.stock > 0,
    lastUpdated: new Date().toISOString(),
    name: product.name,
    category: product.category,
  }));
};

const getMarketTwinMatches = async ({ category, maxBudget, minBatteryHours, noiseCancellation, maxDeliveryDays }) => {
  const products = await getAllProducts();
  return products.filter((product) => {
    const categoryMatch = !category || product.category.toLowerCase() === String(category).toLowerCase();
    const budgetMatch = !maxBudget || product.discountPrice <= Number(maxBudget);
    const batteryMatch = !minBatteryHours || (product.specifications.batteryHours || 0) >= Number(minBatteryHours);
    const noiseMatch = noiseCancellation === undefined || product.specifications.noiseCancellation === noiseCancellation;
    const deliveryMatch = !maxDeliveryDays || product.deliveryDays <= Number(maxDeliveryDays);

    return categoryMatch && budgetMatch && batteryMatch && noiseMatch && deliveryMatch;
  }).map((product) => ({
    productId: product.productId,
    name: product.name,
    brand: product.brand,
    price: product.discountPrice || product.price,
    currency: 'INR',
    category: product.category,
    specifications: product.specifications,
    stock: product.stock,
    deliveryDays: product.deliveryDays,
    available: product.stock > 0,
  }));
};

module.exports = {
  normalizeProductRecord,
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  filterProducts,
  getInventorySummary,
  getMarketTwinMatches,
};
