import { useEffect, useState } from 'react';
import { ArrowRight, BadgePercent, CreditCard, Headphones, Keyboard, Laptop, MonitorSmartphone, ShieldCheck, ShoppingBag, Smartphone, Star, Watch, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const categoryMeta = [
  { name: 'Electronics', icon: Smartphone },
  { name: 'Home & Kitchen', icon: Laptop },
  { name: 'Fashion', icon: MonitorSmartphone },
  { name: 'Beauty', icon: Watch },
  { name: 'Health & Wellness', icon: ShieldCheck },
  { name: 'Sports & Outdoors', icon: Zap },
  { name: 'Books & Media', icon: Headphones },
  { name: 'Everyday Essentials', icon: ShoppingBag },
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts({ sort: 'popular' })
      .then((response) => {
        const nextProducts = Array.isArray(response?.data?.products) ? response.data.products : [];
        setProducts(nextProducts);
      })
      .catch(() => setProducts([]));
  }, []);

  const featured = products.filter((product) => Boolean(product.featured)).slice(0, 8);
  const deals = products.filter((product) => {
    const price = toNumber(product.price, 0);
    const discountPrice = toNumber(product.discountPrice ?? product.price, price);
    return discountPrice > 0 && discountPrice < price;
  }).slice(0, 4);
  const topRated = [...products].sort((a, b) => toNumber(b.rating, 0) - toNumber(a.rating, 0)).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-100 px-6 py-10 shadow-sm md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">Buy + Universe</span>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">A universe of everything.</h1>
            <p className="max-w-lg text-lg text-slate-600">Shop everyday essentials, premium finds, home upgrades, fashion, wellness and tech in one marketplace built for modern life.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Shop Now</Link>
              <Link to="/products?sort=popular" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">Explore Deals</Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-600">
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> 4.8 average rating</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> Secure checkout</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-blue-200/70 blur-3xl" />
            <div className="absolute -right-6 bottom-6 h-40 w-40 rounded-full bg-sky-200/70 blur-3xl" />
            <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80" alt="Electronics showcase" className="relative mx-auto h-[420px] w-full rounded-[28px] object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Shop by category</h2>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryMeta.map(({ name, icon }) => <CategoryCard key={name} category={name} icon={icon} />)}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
          <Link to="/products" className="text-sm font-semibold text-blue-700">Browse catalog</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.productId} product={product} onAddToCart={addToCart} />)}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Best sellers</h2>
          <Link to="/products?sort=popular" className="text-sm font-semibold text-blue-700">See more</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {topRated.map((product) => <ProductCard key={product.productId} product={product} onAddToCart={addToCart} />)}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Special offers</h2>
          <Link to="/products" className="text-sm font-semibold text-blue-700">View deals</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {deals.map((product) => <ProductCard key={product.productId} product={product} onAddToCart={addToCart} />)}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl bg-slate-900 p-6 text-white md:grid-cols-5">
        {[
          { icon: ShieldCheck, title: 'Quality products', text: 'Curated tech built to last.' },
          { icon: BadgePercent, title: 'Competitive prices', text: 'Up to date deals and offers.' },
          { icon: CreditCard, title: 'Secure checkout', text: 'Protected payment flow.' },
          { icon: ShoppingBag, title: 'Reliable tracking', text: 'Live order visibility.' },
          { icon: Headphones, title: 'Customer support', text: 'Expert help whenever needed.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-white/5 p-5">
            <Icon className="mb-3 h-8 w-8 text-blue-400" />
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-slate-300">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
