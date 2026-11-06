import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buyverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const searchProducts = (query) => api.get('/products/search', { params: { q: query } });
export const getCategories = () => Promise.resolve({
  data: {
    categories: ['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty', 'Health & Wellness', 'Sports & Outdoors', 'Books & Media', 'Everyday Essentials'],
  },
});

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getProfile = () => api.get('/auth/profile');
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);

export const fetchCart = () => api.get('/cart');
export const addToCartApi = (productId, quantity = 1) => api.post('/cart/add', { productId, quantity });
export const updateCartQuantity = (productId, quantity) => api.put('/cart/update', { productId, quantity });
export const removeCartItem = (productId) => api.delete(`/cart/remove/${productId}`);

export const fetchWishlist = () => api.get('/wishlist');
export const addWishlistItem = (productId) => api.post('/wishlist/add', { productId });
export const removeWishlistItem = (productId) => api.delete(`/wishlist/remove/${productId}`);

export const createOrder = (payload) => api.post('/orders/create', payload);
export const fetchOrders = () => api.get('/orders');

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminProducts = () => api.get('/admin/products');
export const getAdminOrders = () => api.get('/admin/orders');
export const getAdminCustomers = () => api.get('/admin/customers');

export default api;
