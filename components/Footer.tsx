
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* About */}
          <div className="space-y-6">
            <h3 className="text-white text-2xl font-black font-sans tracking-tight">berrima<span className="text-green-500">store</span></h3>
            <p className="text-sm leading-relaxed font-bold opacity-70">
              وجهتك الأولى للتسوق الإلكتروني في المغرب. نقدم أفضل المنتجات الإلكترونية والمنزلية وإكسسوارات السيارات بجودة عالية وأسعار تنافسية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:text-green-500 transition-all border border-white/5 hover:border-green-500/30"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:text-green-500 transition-all border border-white/5 hover:border-green-500/30"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-black uppercase tracking-widest">روابط سريعة</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-bold hover:text-green-500 transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="text-sm font-bold hover:text-green-500 transition-colors">المنتجات</Link></li>
              <li><Link to="/checkout" className="text-sm font-bold hover:text-green-500 transition-colors">سلة المشتريات</Link></li>
              <li><Link to="/privacy" className="text-sm font-bold hover:text-green-500 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/admin" className="text-sm font-bold hover:text-green-500 transition-colors">لوحة التحكم</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-black uppercase tracking-widest">تواصل معنا</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-green-500/5 rounded-2xl text-green-500 border border-green-500/10 group-hover:bg-green-500 group-hover:text-black transition-all">
                    <Phone className="h-5 w-5" />
                </div>
                <span className="text-sm font-black" dir="ltr">0688775968</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-green-500/5 rounded-2xl text-green-500 border border-green-500/10 group-hover:bg-green-500 group-hover:text-black transition-all">
                    <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">support@berrima.store</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-green-500/5 rounded-2xl text-green-500 border border-green-500/10 group-hover:bg-green-500 group-hover:text-black transition-all">
                    <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">مكناس، المغرب</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="border-t border-white/5 mt-16 pt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          <p>&copy; {new Date().getFullYear()} berrima store. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;