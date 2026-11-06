import { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then((response) => setOrders(response.data.orders || [])).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-6 pb-16">
      <div className="rounded-2xl bg-slate-100 p-5">
        <h1 className="text-3xl font-bold text-slate-900">Order history</h1>
      </div>
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">{order.id}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{order.items?.[0]?.name}</h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">{order.status}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-4">
                <div><span className="block text-slate-400">Total</span>₹{Number(order.total || 0).toLocaleString('en-IN')}</div>
                <div><span className="block text-slate-400">Payment</span>{order.paymentStatus}</div>
                <div><span className="block text-slate-400">Date</span>{new Date(order.createdAt).toLocaleDateString()}</div>
                <div><span className="block text-slate-400">Delivery</span>{order.shippingAddress?.city || 'India'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">No orders yet.</div>
      )}
    </div>
  );
}
