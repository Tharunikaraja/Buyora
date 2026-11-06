import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const delivery = subtotal > 20000 ? 0 : cartItems.length ? 299 : 0;
  const total = subtotal + delivery;

  if (!cartItems.length) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center text-slate-600">Your cart is empty. <Link to="/products" className="font-semibold text-blue-600">Continue shopping</Link></div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr] pb-16">
      <div className="space-y-5">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <img src={item.image} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">₹{Number(item.price).toLocaleString('en-IN')} each</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                  <button type="button" onClick={() => updateQuantity(item.productId, Math.max(1, Number(item.quantity) - 1))} className="p-2 text-slate-600"><Minus className="h-4 w-4" /></button>
                  <span className="min-w-10 text-center font-medium">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, Number(item.quantity) + 1)} className="p-2 text-slate-600"><Plus className="h-4 w-4" /></button>
                </div>
                <button type="button" onClick={() => removeFromCart(item.productId)} className="inline-flex items-center gap-2 text-sm font-medium text-red-600"><Trash2 className="h-4 w-4" /> Remove</button>
              </div>
            </div>
            <div className="text-right text-lg font-bold text-slate-900">₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Order Summary</h2>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>₹{delivery.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
        <Link to="/checkout" className="mt-6 block rounded-full bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700">Proceed to Checkout</Link>
      </aside>
    </div>
  );
}
