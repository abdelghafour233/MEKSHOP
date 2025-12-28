import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-sans">berrima store</h3>
            <p className="text-sm leading-relaxed mb-4">
              وجهتك الأولى للتسوق الإلكتروني في المغرب. نقدم أفضل المنتجات الإلكترونية والمنزلية وإكسسوارات السيارات بجودة عالية وأسعار تنافسية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-amber-500 transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="text-sm hover:text-amber-500 transition-colors">المنتجات</Link></li>
              <li><Link to="/checkout" className="text-sm hover:text-amber-500 transition-colors">سلة المشتريات</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-amber-500 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/admin" className="text-sm hover:text-amber-500 transition-colors">لوحة التحكم</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-500" />
                <span className="text-sm" dir="ltr">0688775968</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-500" />
                <span className="text-sm">support@berrima.store</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-500" />
                <span className="text-sm">مكناس، المغرب</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} berrima store. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;