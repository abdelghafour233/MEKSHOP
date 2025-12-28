
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShoppingBag, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path 
    ? 'text-green-600 dark:text-green-500 font-bold' 
    : 'text-slate-600 dark:text-gray-400 hover:text-green-500';
    
  const mobileIsActive = (path: string) => location.pathname === path 
    ? 'bg-green-500/10 text-green-600 dark:text-green-500 font-bold' 
    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-green-500';

  return (
    <nav className="bg-white/80 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
                <div className="p-2 bg-green-500 rounded-xl shadow-lg shadow-green-500/20">
                    <ShoppingBag className="h-6 w-6 text-black" />
                </div>
                <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">berrima<span className="text-green-500">store</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline gap-8">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${isActive('/')}`}>الرئيسية</Link>
              <Link to="/products" className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${isActive('/products')}`}>جميع المنتجات</Link>
            </div>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-2 md:gap-4">
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-gray-400 hover:text-green-500 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                title={theme === 'dark' ? "تفعيل نظام النهار" : "تفعيل نظام الليل"}
             >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
             </button>

             {/* Admin Link */}
             <Link to="/admin" className="p-2 text-slate-500 dark:text-gray-400 hover:text-green-500 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5" title="لوحة التحكم">
                <User className="h-6 w-6" />
             </Link>

             {/* Cart Link */}
             <Link to="/checkout" className="relative p-2 text-slate-500 dark:text-gray-400 hover:text-green-500 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white dark:text-black transform translate-x-1/4 -translate-y-1/4 bg-green-600 dark:bg-green-500 rounded-full shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none transition-all"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-slate-200 dark:border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-bold transition-all ${mobileIsActive('/')}`}
            >
                الرئيسية
            </Link>
            <Link 
                to="/products" 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-bold transition-all ${mobileIsActive('/products')}`}
            >
                جميع المنتجات
            </Link>
            <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-bold transition-all ${mobileIsActive('/admin')}`}
            >
                لوحة التحكم
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;