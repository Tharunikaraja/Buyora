import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const categories = ['Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Keyboards', 'Computer Accessories', 'Speakers', 'Gaming Accessories'];
const brands = ['Samsung', 'OnePlus', 'Redmi', 'HP', 'Dell', 'Lenovo', 'Sony', 'JBL', 'boAt', 'Noise', 'Logitech', 'Apple', 'Acer', 'Asus', 'Bose', 'Corsair'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: '',
    stock: false,
  });

  useEffect(() => {
    setLoading(true);
    const params = {
      q: filters.q,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brand: filters.brand,
      rating: filters.rating,
      stock: filters.stock ? 'true' : '',
    };

    getProducts(params)
      .then((response) => {
        const nextProducts = Array.isArray(response?.data?.products) ? response.data.products : [];
        setProducts(nextProducts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    setFilters((current) => ({ ...current, q, category }));
  }, [searchParams]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const activeCount = useMemo(() => Object.values(filters).filter((value) => value !== '' && value !== false).length, [filters]);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-100 px-6 py-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Electronics & accessories</h1>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <span className="font-semibold text-slate-900">{products.length}</span> products
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800"><SlidersHorizontal className="h-5 w-5 text-blue-600" /> Filters</div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
            <input value={filters.q} onChange={(event) => updateFilter('q', event.target.value)} placeholder="Search products" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Min price</label>
              <input type="number" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Max price</label>
              <input type="number" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Brand</label>
            <select value={filters.brand} onChange={(event) => updateFilter('brand', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">All brands</option>
              {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
            <select value={filters.rating} onChange={(event) => updateFilter('rating', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">All ratings</option>
              {[4, 4.3, 4.5, 4.7, 4.8].map((rating) => <option key={rating} value={rating}>{rating}+ stars</option>)}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={filters.stock} onChange={(event) => updateFilter('stock', event.target.checked)} />
            In stock only
          </label>

          <button type="button" onClick={() => setFilters({ q: '', category: '', minPrice: '', maxPrice: '', brand: '', rating: '', stock: false })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
            Reset ({activeCount})
          </button>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{products.length}</span> results</p>
            <select value={searchParams.get('sort') || ''} onChange={(event) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">Sort by</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="popular">Popularity</option>
            </select>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}</div>
          ) : products.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => <ProductCard key={product.productId} product={product} onAddToCart={addToCart} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">No products match your current filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
