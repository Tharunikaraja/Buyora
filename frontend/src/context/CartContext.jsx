import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCart, addToCartApi, updateCartQuantity, removeCartItem } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('buyverse_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('buyverse_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (token) {
      fetchCart().then((response) => setCartItems(response.data.items || [])).catch(() => setCartItems([]));
    }
  }, [token]);

  const addToCart = async (product, quantity = 1) => {
    if (token) {
      const response = await addToCartApi(product.productId || product.id, quantity);
      setCartItems(response.data.items || []);
      return;
    }

    const item = { productId: product.productId || product.id, name: product.name, image: product.images?.[0], price: product.discountPrice || product.price, quantity };
    setCartItems((current) => {
      const existing = current.find((detail) => detail.productId === item.productId);
      if (existing) {
        return current.map((detail) => detail.productId === item.productId ? { ...detail, quantity: detail.quantity + quantity } : detail);
      }
      return [...current, item];
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (token) {
      const response = await updateCartQuantity(productId, quantity);
      setCartItems(response.data.items || []);
      return;
    }

    setCartItems((current) => current.map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0));
  };

  const removeFromCart = async (productId) => {
    if (token) {
      const response = await removeCartItem(productId);
      setCartItems(response.data.items || []);
      return;
    }

    setCartItems((current) => current.filter((item) => item.productId !== productId));
  };

  const cartCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const subtotal = cartItems.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const value = useMemo(() => ({ cartItems, cartCount, subtotal, addToCart, updateQuantity, removeFromCart, setCartItems }), [cartItems, cartCount, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
