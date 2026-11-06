import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login.');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 text-slate-600">Sign in to your BUYVERSE account.</p>
      {error ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
        </div>
        <button type="submit" className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">New to BUYVERSE? <Link to="/register" className="font-semibold text-blue-700">Create an account</Link></p>
    </div>
  );
}
