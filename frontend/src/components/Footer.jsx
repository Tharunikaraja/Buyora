import { BriefcaseBusiness, Camera, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="mb-4 text-2xl font-black tracking-tight text-white">BUYVERSE</div>
          <p className="text-sm text-slate-400">A universe of everything — from everyday essentials to premium lifestyle picks, gadgets, fashion, home finds, and more.</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Customer support</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/orders">Order tracking</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 80000 00000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@buyverse.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bengaluru, India</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Follow us</h3>
          <div className="flex gap-3 text-slate-400">
            <a href="https://facebook.com" className="rounded-full border border-slate-700 p-2"><Globe className="h-4 w-4" /></a>
            <a href="https://instagram.com" className="rounded-full border border-slate-700 p-2"><Camera className="h-4 w-4" /></a>
            <a href="https://linkedin.com" className="rounded-full border border-slate-700 p-2"><BriefcaseBusiness className="h-4 w-4" /></a>
          </div>
          <div className="mt-6 space-y-2 text-sm text-slate-400">
            <Link to="/privacy">Privacy policy</Link>
            <div><Link to="/terms">Terms and conditions</Link></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
