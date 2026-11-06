import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('buyverse_wishlist') || '[]');
    if (saved.length) {
      const ids = saved.map((item) => item.productId);
      getProducts().then((response) => {
        const matched = response.data.products.filter((product) => ids.includes(product.productId));
        setItems(matched);
      });
    }
  }, []);

  if (!items.length) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center text-slate-600">No wishlist items yet. <Link to="/products" className="font-semibold text-blue-600">Shop now</Link></div>;
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-5">
        <h1 className="text-3xl font-bold text-slate-900">Wishlist</h1>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{items.length} saved</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => <ProductCard key={product.productId} product={product} onAddToCart={addToCart} />)}
      </div>
    </div>
  );
}
