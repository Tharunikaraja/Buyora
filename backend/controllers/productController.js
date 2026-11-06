const { filterProducts, getAllProducts, getProductById, getProductsByCategory, searchProducts } = require('../services/productService');

const listProducts = async (req, res) => {
  const { minPrice, maxPrice, brand, category, rating, stock, deliveryMax, sort, q } = req.query;

  let products = q ? await searchProducts(q) : await getAllProducts();
  const filteredProducts = await filterProducts({
    minPrice,
    maxPrice,
    brand,
    category,
    rating,
    stockAvailable: stock === 'true',
    deliveryMax,
  });

  products = q
    ? filteredProducts.filter((product) => {
        const hasBrand = !brand || product.brand.toLowerCase() === String(brand).toLowerCase();
        const hasCategory = !category || product.category.toLowerCase() === String(category).toLowerCase();
        const hasMin = !minPrice || product.discountPrice >= Number(minPrice);
        const hasMax = !maxPrice || product.discountPrice <= Number(maxPrice);
        const hasRating = !rating || product.rating >= Number(rating);
        const hasStock = stock !== 'true' || product.stock > 0;
        const hasDelivery = !deliveryMax || product.deliveryDays <= Number(deliveryMax);
        return hasBrand && hasCategory && hasMin && hasMax && hasRating && hasStock && hasDelivery;
      })
    : filteredProducts;

  if (sort === 'low-to-high') products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  if (sort === 'high-to-low') products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  if (sort === 'highest-rated') products.sort((a, b) => b.rating - a.rating);
  if (sort === 'newest') products.sort((a, b) => (b.productId > a.productId ? 1 : -1));
  if (sort === 'popular') products.sort((a, b) => b.reviews - a.reviews);

  return res.json({ success: true, products, count: products.length });
};

const getProduct = async (req, res) => {
  const product = await getProductById(req.params.productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  return res.json({ success: true, product });
};

const getProductsByCategoryRoute = async (req, res) => {
  const category = req.params.category;
  const products = await getProductsByCategory(category);
  return res.json({ success: true, products, count: products.length });
};

const searchProductsRoute = async (req, res) => {
  const query = req.query.q || '';
  const result = await searchProducts(query);
  return res.json({ success: true, products: result, count: result.length });
};

module.exports = {
  listProducts,
  getProduct,
  getProductsByCategoryRoute,
  searchProductsRoute,
};
