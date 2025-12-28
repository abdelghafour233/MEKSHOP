
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useProducts();
  
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="space-y-24 pb-20 transition-colors duration-500 bg-slate-50 dark:bg-black">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-900 dark:bg-black text-white">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-slate-900/80 dark:via-black/80 to-slate-900 dark:to-black z-10"></div>
             <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-6 py-2.5 rounded-full text-green-400 text-sm font-black mb-10 animate-pulse">
            <Zap className="w-4 h-4" /> عروض حصرية لفترة محدودة
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter">
            متجر <span className="text-green-500">بريمة</span><br/>قوة الجودة
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 dark:text-gray-400 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            الوجهة الأولى في المغرب للإلكترونيات الذكية، ديكور المنزل، وإكسسوارات السيارات الفاخرة. جودة تليق بك ودفع عند الاستلام.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 text-black px-12 py-6 rounded-3xl font-black text-2xl hover:bg-green-400 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/20"
            >
              تسوق الآن
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Link 
              to="/products?category=electronics" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 px-12 py-6 rounded-3xl font-black text-2xl hover:bg-white/20 transition-all"
            >
              الأحدث
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-[40px] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:border-green-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl">
                    <div className="bg-green-500/10 p-5 rounded-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                        <Truck className="h-12 w-12 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="font-black text-2xl mb-4 text-slate-900 dark:text-white">دفع عند الاستلام</h3>
                    <p className="text-slate-500 dark:text-gray-500 leading-relaxed font-bold">أمان تام، ادفع فقط بعد معاينة طلبك والتأكد من جودته</p>
                </div>
                <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-[40px] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:border-green-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl">
                    <div className="bg-green-500/10 p-5 rounded-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                        <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="font-black text-2xl mb-4 text-slate-900 dark:text-white">منتجات أصلية</h3>
                    <p className="text-slate-500 dark:text-gray-500 leading-relaxed font-bold">نحن في berrima store نضمن لك جودة 100% لكل منتج معروض</p>
                </div>
                <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-[40px] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:border-green-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl">
                    <div className="bg-green-500/10 p-5 rounded-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                        <Headphones className="h-12 w-12 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="font-black text-2xl mb-4 text-slate-900 dark:text-white">دعم متواصل</h3>
                    <p className="text-slate-500 dark:text-gray-500 leading-relaxed font-bold">فريقنا متاح دائماً عبر الواتساب للإجابة على جميع استفساراتكم</p>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
            <div>
                <p className="text-green-600 dark:text-green-500 font-black text-sm uppercase tracking-widest mb-4">اختياراتنا لك</p>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">الأكثر طلباً</h2>
            </div>
            <Link to="/products" className="text-green-600 dark:text-green-500 hover:text-green-400 font-black flex items-center gap-2 group text-lg">
                كل المتجر <ArrowLeft className="h-6 w-6 group-hover:-translate-x-2 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-100 dark:bg-[#050505] py-24 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white">تصفح أقسامنا</h2>
                <p className="text-slate-500 dark:text-gray-500 mt-6 text-xl">كل ما تحتاجه في مكان واحد</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Link to="/products?category=electronics" className="relative h-[450px] rounded-[48px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1498049384371-061895450719?auto=format&fit=crop&w=800&q=80" alt="Electronics" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80 dark:opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-slate-900/20 dark:via-black/20 to-transparent flex flex-col justify-end p-12">
                        <h3 className="text-white text-4xl font-black mb-3">إلكترونيات</h3>
                        <p className="text-green-400 dark:text-green-500 text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
                    </div>
                </Link>
                <Link to="/products?category=home" className="relative h-[450px] rounded-[48px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" alt="Home" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80 dark:opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-slate-900/20 dark:via-black/20 to-transparent flex flex-col justify-end p-12">
                        <h3 className="text-white text-4xl font-black mb-3">المنزل</h3>
                        <p className="text-green-400 dark:text-green-500 text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
                    </div>
                </Link>
                <Link to="/products?category=cars" className="relative h-[450px] rounded-[48px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" alt="Cars" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80 dark:opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-slate-900/20 dark:via-black/20 to-transparent flex flex-col justify-end p-12">
                        <h3 className="text-white text-4xl font-black mb-3">السيارات</h3>
                        <p className="text-green-400 dark:text-green-500 text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
                    </div>
                </Link>
             </div>
        </div>
      </section>
    </div>
  );
};

export default Home;