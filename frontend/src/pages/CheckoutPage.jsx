import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const [shipping, setShipping] = useState({ fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const delivery = subtotal > 20000 ? 0 : cartItems.length ? 299 : 0;
  const total = subtotal + delivery;

  const payNow = async () => {
    setLoading(true);
    try {
      const response = await createOrder({ shippingAddress: shipping, items: cartItems });
      setCartItems([]);
      navigate('/orders', { state: { order: response.data.order } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] pb-16">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Checkout</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={shipping.fullName} onChange={(event) => setShipping({ ...shipping, fullName: event.target.value })} placeholder="Full name" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          <input value={shipping.email} onChange={(event) => setShipping({ ...shipping, email: event.target.value })} placeholder="Email" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          <input value={shipping.phone} onChange={(event) => setShipping({ ...shipping, phone: event.target.value })} placeholder="Phone" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:col-span-2" />
          <input value={shipping.address} onChange={(event) => setShipping({ ...shipping, address: event.target.value })} placeholder="Street address" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:col-span-2" />
          <input value={shipping.city} onChange={(event) => setShipping({ ...shipping, city: event.target.value })} placeholder="City" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          <input value={shipping.state} onChange={(event) => setShipping({ ...shipping, state: event.target.value })} placeholder="State" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          <input value={shipping.pincode} onChange={(event) => setShipping({ ...shipping, pincode: event.target.value })} placeholder="Pincode" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:col-span-2" />
        </div>
        <button type="button" onClick={payNow} disabled={loading} className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Processing...' : 'Pay with PayPal Sandbox'}
        </button>
      </div>

      <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Summary</h2>
        {cartItems.map((item) => (
          <div key={item.productId} className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>₹{delivery.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-base font-bold text-slate-900"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
      </aside>
    </div>
  );
}
