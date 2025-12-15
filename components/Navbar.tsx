import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-amber-500 font-bold' : 'text-gray-200 hover:text-white';
  const mobileIsActive = (path: string) => location.pathname === path ? 'bg-blue-800 text-amber-500 font-bold' : 'text-gray-200 hover:bg-blue-800 hover:text-white';

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
                <ShoppingBag className="h-8 w-8 text-amber-500" />
                <span className="font-bold text-xl tracking-wide font-sans">MekShop</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline gap-8">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>الرئيسية</Link>
              <Link to="/products" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/products')}`}>جميع المنتجات</Link>
            </div>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-2 md:gap-4">
             {/* Admin Link */}
             <Link to="/admin" className="p-2 text-gray-200 hover:text-amber-500 transition-colors" title="لوحة التحكم">
                <User className="h-6 w-6" />
             </Link>

             {/* Cart Link */}
             <Link to="/checkout" className="relative p-2 text-gray-200 hover:text-white transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-900 transform translate-x-1/4 -translate-y-1/4 bg-amber-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-blue-800 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${mobileIsActive('/')}`}
            >
                الرئيسية
            </Link>
            <Link 
                to="/products" 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${mobileIsActive('/products')}`}
            >
                جميع المنتجات
            </Link>
            <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${mobileIsActive('/admin')}`}
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