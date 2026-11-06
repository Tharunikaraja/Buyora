import { ShoppingCart, Heart, Search, Menu, UserCircle2, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/products' },
  { label: 'Deals', to: '/products' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 font-black text-white">B</div>
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900">BUYVERSE</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">A universe of everything</div>
              </div>
            </Link>
            <button type="button" className="rounded-lg border border-slate-200 p-2 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} className={({ isActive }) => isActive ? 'text-blue-700' : 'hover:text-blue-700'}>{item.label}</NavLink>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden flex-1 max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input placeholder="Search products..." className="w-full bg-transparent text-sm outline-none" />
            </div>
            {user ? (
              <>
                <Link to="/wishlist" className="rounded-full border border-slate-200 p-2 text-slate-700"><Heart className="h-5 w-5" /></Link>
                <Link to="/cart" className="relative rounded-full border border-slate-200 p-2 text-slate-700"><ShoppingCart className="h-5 w-5" /><span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">{cartCount}</span></Link>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
                  <UserCircle2 className="h-4 w-4 text-slate-600" />
                  <span className="hidden md:inline">{user.fullName}</span>
                </div>
                <button type="button" onClick={logout} className="rounded-full border border-slate-200 p-2 text-slate-700"><LogOut className="h-4 w-4" /></button>
              </>
            ) : (
              <>
                <Link to="/wishlist" className="rounded-full border border-slate-200 p-2 text-slate-700"><Heart className="h-5 w-5" /></Link>
                <Link to="/cart" className="relative rounded-full border border-slate-200 p-2 text-slate-700"><ShoppingCart className="h-5 w-5" /><span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">{cartCount}</span></Link>
                <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Login</Link>
                <Link to="/register" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
