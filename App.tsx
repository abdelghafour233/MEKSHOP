
import React, { useEffect, useState } from 'react';
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
    
    // SEO: Dynamic Titles and Descriptions
    const siteName = "berrima store | متجر بريمة";
    let pageTitle = siteName;
    let pageDesc = "تسوق أفضل المنتجات في المغرب مع توصيل مجاني والدفع عند الاستلام.";

    if (pathname === '/') {
      pageTitle = `${siteName} - الصفحة الرئيسية`;
    } else if (pathname === '/products') {
      pageTitle = `تصفح المنتجات - ${siteName}`;
      pageDesc = "استكشف مجموعتنا الواسعة من الإلكترونيات، الساعات، وإكسسوارات السيارات بجودة عالية.";
    } else if (pathname === '/checkout') {
      pageTitle = `تأكيد طلبك - ${siteName}`;
      pageDesc = "أكمل طلبك الآن واستفد من التوصيل المجاني والدفع عند الاستلام.";
    } else if (pathname === '/admin') {
      pageTitle = `لوحة التحكم - ${siteName}`;
    }
    
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);
  }, [pathname]);
  return null;
};

const AnnouncementBar = () => (
  <div className="bg-green-600 text-black py-2 px-4 text-center text-xs md:text-sm font-black flex items-center justify-center gap-2 shadow-inner">
    <Truck className="w-4 h-4" />
    <span>توصيل منزلي مجاني وسريع لجميع المدن المغربية 🚚</span>
  </div>
);

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('berrima_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('berrima_theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <SettingsProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <TrackingScripts />
                <div className="flex flex-col min-h-screen font-sans transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100">
                  <AnnouncementBar />
                  <Navbar theme={theme} toggleTheme={toggleTheme} />
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
    </div>
  );
}

export default App;
