
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { SettingsProvider } from './context/SettingsContext';
import { OrderProvider } from './context/OrderContext';
import TrackingScripts from './components/TrackingScripts';
import { Truck } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnnouncementBar = () => (
  <div className="bg-amber-500 text-slate-950 py-2 px-4 text-center text-xs md:text-sm font-black flex items-center justify-center gap-2 shadow-inner">
    <Truck className="w-4 h-4" />
    <span>توصيل منزلي مجاني وسريع لجميع المدن المغربية 🚚</span>
  </div>
);

function App() {
  return (
    <SettingsProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <TrackingScripts />
              <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-slate-100">
                <AnnouncementBar />
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </SettingsProvider>
  );
}

export default App;
