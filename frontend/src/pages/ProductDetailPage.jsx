import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(id).then((response) => {
      const item = response.data.product;
      setProduct(item);
      getProducts({ category: item.category }).then((list) => setRecommended((list.data.products || []).filter((entry) => entry.productId !== item.productId).slice(0, 4)));
    });
  }, [id]);

  if (!product) {
    return <div className="rounded-2xl bg-slate-100 p-12 text-center text-slate-600">Loading product...</div>;
  }

  const wishlistItem = () => {
    const key = 'buyverse_wishlist';
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    if (!current.some((item) => item.productId === product.productId)) {
      localStorage.setItem(key, JSON.stringify([...current, { productId: product.productId, name: product.name, image: product.images?.[0] }]));
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <img src={product.images?.[0]} alt={product.name} className="h-[460px] w-full rounded-[28px] object-cover shadow-lg" />
          <div className="grid grid-cols-3 gap-3">
            {product.images?.slice(0, 3).map((image, index) => (
              <img key={index} src={image} alt={`${product.name} view ${index + 1}`} className="h-28 w-full rounded-2xl object-cover" />
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category}</span>
            <button type="button" onClick={wishlistItem} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
              <Heart className="h-4 w-4" /> Wishlist
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-2 text-lg text-slate-500">{product.brand}</p>
          </div>

          <div className="flex items-center gap-2 text-amber-500">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-semibold text-slate-800">{product.rating}</span>
            <span className="text-slate-500">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
            {product.discountPrice && product.discountPrice < product.price ? (
              <span className="text-lg text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
            ) : null}
          </div>

          <p className="text-slate-600">{product.description}</p>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3 py-2 text-lg">-</button>
              <span className="min-w-12 text-center font-semibold">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-3 py-2 text-lg">+</button>
            </div>
            <button type="button" onClick={() => addToCart(product, quantity)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="rounded-full border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700">Buy Now</button>
            <button type="button" className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700">Add to Wishlist</button>
          </div>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-blue-600" /> Estimated delivery: {product.deliveryDays} days</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> {product.stock > 0 ? 'In stock and ready to ship' : 'Currently out of stock'}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Specifications</h2>
          <div className="space-y-3">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
                <span className="font-medium capitalize text-slate-500">{key}</span>
                <span className="text-slate-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Reviews</h2>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" /> <span className="font-semibold text-slate-800">{product.rating}/5</span></div>
              <p className="mt-2 text-sm text-slate-600">Excellent build quality, great performance, and fast delivery. A truly dependable purchase.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" /> <span className="font-semibold text-slate-800">4.8/5</span></div>
              <p className="mt-2 text-sm text-slate-600">The battery life and camera quality exceeded my expectations. Perfect for daily use.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Similar products</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {recommended.map((item) => <ProductCard key={item.productId} product={item} onAddToCart={addToCart} />)}
        </div>
      </section>
    </div>
  );
}
