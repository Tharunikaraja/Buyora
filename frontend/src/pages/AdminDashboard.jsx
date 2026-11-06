import { useEffect, useState } from 'react';
import { getAdminCustomers, getAdminOrders, getAdminProducts, getAdminStats } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminProducts(), getAdminOrders(), getAdminCustomers()]).then(([statsRes, productsRes, ordersRes, customersRes]) => {
      setStats(statsRes.data.stats || {});
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setCustomers(customersRes.data.customers || []);
    });
  }, []);

  return (
    <div className="space-y-8 pb-16">
      <div className="rounded-2xl bg-slate-100 p-5">
        <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total products', value: stats.totalProducts || 0 },
          { label: 'Total customers', value: stats.totalCustomers || 0 },
          { label: 'Total orders', value: stats.totalOrders || 0 },
          { label: 'Total revenue', value: `₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}` },
          { label: 'Pending orders', value: stats.pendingOrders || 0 },
          { label: 'Low stock', value: stats.lowStockProducts || 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Recent orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <span>{order.id}</span>
                <span>{order.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.productId} className="flex justify-between rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <span>{product.name}</span>
                <span>{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
