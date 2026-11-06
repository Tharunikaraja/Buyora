import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category, icon: Icon }) {
  return (
    <Link to={`/products?category=${encodeURIComponent(category)}`} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{category}</h3>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
    </Link>
  );
}
