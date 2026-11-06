import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const price = product.discountPrice || product.price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/product/${product.productId}`} className="block">
        <div className="relative">
          <img src={product.images?.[0]} alt={product.name} className="h-56 w-full object-cover" />
          {product.discountPrice && product.discountPrice < product.price ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{product.brand}</span>
          <span className="inline-flex items-center gap-1 font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            {product.rating}
          </span>
        </div>

        <Link to={`/product/${product.productId}`} className="block font-semibold text-slate-800 hover:text-blue-700">
          {product.name}
        </Link>

        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
          {product.discountPrice && product.discountPrice < product.price ? (
            <span className="text-sm text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          <button type="button" onClick={() => onAddToCart(product)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
