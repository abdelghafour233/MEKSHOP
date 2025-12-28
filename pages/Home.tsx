import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useProducts();
  
  const featuredProducts = products.slice(0, 3);
  const newArrivals = products.slice(3, 7);

  return (
    <div className="space-y-16 pb-20 bg-slate-950">
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-slate-950/80 to-slate-950 z-10"></div>
             <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-sm font-bold mb-8 animate-pulse">
            <Zap className="w-4 h-4" /> عروض حصرية لفترة محدودة
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            متجر <span className="text-amber-500">بريمة</span><br/>عالم من الإبداع
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            الوجهة الأولى في المغرب للإلكترونيات الذكية، ديكور المنزل، وإكسسوارات السيارات الفاخرة. جودة تليق بك ودفع عند الاستلام.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all transform hover:scale-105 shadow-2xl shadow-amber-500/20"
            >
              تسوق الآن
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Link 
              to="/products?category=electronics" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-slate-100 border border-slate-800 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all"
            >
              أحدث الإلكترونيات
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 flex flex-col items-center text-center group hover:border-amber-500/50 transition-all">
                    <div className="bg-amber-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                        <Truck className="h-10 w-10 text-amber-500" />
                    </div>
                    <h3 className="font-black text-xl mb-3 text-slate-100">دفع عند الاستلام</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">أمان تام، ادفع فقط بعد معاينة طلبك والتأكد من جودته</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all">
                    <div className="bg-blue-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="font-black text-xl mb-3 text-slate-100">منتجات أصلية</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">نحن في berrima store نضمن لك جودة 100% لكل منتج معروض</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                        <Headphones className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="font-black text-xl mb-3 text-slate-100">دعم متواصل</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">فريقنا متاح دائماً عبر الواتساب للإجابة على جميع استفساراتكم</p>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-100">الأكثر طلباً</h2>
                <div className="h-1.5 w-20 bg-amber-500 mt-4 rounded-full"></div>
            </div>
            <Link to="/products" className="text-amber-500 hover:text-amber-400 font-black flex items-center gap-2 group">
                عرض المتجر بالكامل <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-900 py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-100">تصفح أقسامنا</h2>
                <p className="text-slate-500 mt-4">كل ما تحتاجه في مكان واحد</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link to="/products?category=electronics" className="relative h-80 rounded-[40px] overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1498049384371-061895450719?auto=format&fit=crop&w=800&q=80" alt="Electronics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-10">
                        <h3 className="text-white text-3xl font-black mb-2">إلكترونيات</h3>
                        <p className="text-slate-300 text-sm">أحدث التقنيات بين يديك</p>
                    </div>
                </Link>
                <Link to="/products?category=home" className="relative h-80 rounded-[40px] overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" alt="Home" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-10">
                        <h3 className="text-white text-3xl font-black mb-2">المنزل</h3>
                        <p className="text-slate-300 text-sm">لمسة عصرية لكل زاوية</p>
                    </div>
                </Link>
                <Link to="/products?category=cars" className="relative h-80 rounded-[40px] overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" alt="Cars" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-10">
                        <h3 className="text-white text-3xl font-black mb-2">السيارات</h3>
                        <p className="text-slate-300 text-sm">إضافات ذكية لسيارتك</p>
                    </div>
                </Link>
             </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-3xl font-black text-slate-100 mb-12">وصل حديثاً لمتجرنا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;