import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
      <Route path="/product/:id" element={<AppLayout><ProductDetailPage /></AppLayout>} />
      <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
      <Route path="/checkout" element={<ProtectedRoute><AppLayout><CheckoutPage /></AppLayout></ProtectedRoute>} />
      <Route path="/wishlist" element={<AppLayout><WishlistPage /></AppLayout>} />
      <Route path="/orders" element={<ProtectedRoute><AppLayout><OrderHistoryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
      <Route path="/register" element={<AppLayout><RegisterPage /></AppLayout>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<AppLayout><div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center text-slate-600">Page not found.</div></AppLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
