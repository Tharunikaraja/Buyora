import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getProductImage = (product) => {
  if (Array.isArray(product?.images) && product.images.length) return product.images[0];
  if (typeof product?.images === 'string' && product.images.trim()) return product.images;
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
};

export default function ProductCard({ product, onAddToCart }) {
  const originalPrice = toNumber(product?.price ?? product?.discountPrice ?? 0, 0);
  const salePrice = toNumber(product?.discountPrice ?? product?.price ?? 0, originalPrice);
  const stock = toNumber(product?.stock ?? 0, 0);
  const rating = toNumber(product?.rating ?? 0, 0);
  const brand = product?.brand || 'BUYORA';
  const description = product?.description || 'Premium product from BUYORA.';
  const hasDiscount = salePrice > 0 && salePrice < originalPrice;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/product/${product.productId || product.id}`} className="block">
        <div className="relative">
          <img src={getProductImage(product)} alt={product?.name || 'BUYORA product'} className="h-56 w-full object-cover" />
          {hasDiscount ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
              {Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% off
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{brand}</span>
          <span className="inline-flex items-center gap-1 font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            {rating > 0 ? rating.toFixed(1) : 'New'}
          </span>
        </div>

        <Link to={`/product/${product.productId || product.id}`} className="block font-semibold text-slate-800 hover:text-blue-700">
          {product?.name || 'BUYORA Product'}
        </Link>

        <p className="line-clamp-2 text-sm text-slate-600">{description}</p>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">₹{salePrice.toLocaleString('en-IN')}</span>
          {hasDiscount ? (
            <span className="text-sm text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={stock === 0}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${stock === 0 ? 'cursor-not-allowed bg-slate-300 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {stock === 0 ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
