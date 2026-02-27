import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/ProductForm';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
      <AuthProvider>
        <Navbar />
        <main className="grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        {/* ================= WHATSAPP FLUTUANTE ================= */}
        <a
          href="https://wa.me/5563992952695"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition hover:scale-105"
          aria-label="Falar no WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6 md:w-8 md:h-8"
          >
            <path d="M12.04 2a9.93 9.93 0 0 0-8.47 15.14L2 22l4.99-1.54A9.93 9.93 0 1 0 12.04 2Zm5.8 13.85c-.25.7-1.46 1.35-2.04 1.44-.55.08-1.24.11-2-.14-.46-.15-1.05-.34-1.8-.65-3.17-1.37-5.24-4.6-5.4-4.82-.15-.2-1.28-1.7-1.28-3.24 0-1.54.8-2.3 1.08-2.62.28-.32.6-.4.8-.4h.58c.19 0 .45-.07.7.54.25.6.86 2.1.94 2.25.08.15.13.34.03.54-.1.2-.15.34-.3.52-.15.18-.32.4-.46.54-.15.15-.3.3-.13.6.17.3.76 1.26 1.63 2.05 1.12 1.02 2.06 1.34 2.36 1.49.3.15.47.13.65-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.65-.15.25.1 1.6.75 1.88.88.28.13.47.2.54.32.08.12.08.7-.17 1.4Z"/>
          </svg>
        </a>
      </AuthProvider>
    </div>
  );
}
