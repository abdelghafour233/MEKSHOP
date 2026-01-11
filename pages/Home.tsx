
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  const homeCategories = [
    { cat: 'electronics', title: 'إلكترونيات', img: 'https://images.unsplash.com/photo-1498049384371-061895450719?auto=format&fit=crop&w=800&q=80' },
    { cat: 'car_accessories', title: 'إكسسوارات سيارات', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' },
    { cat: 'glasses', title: 'نظارات شمسية', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="space-y-12 md:space-y-24 pb-20 bg-slate-50 dark:bg-black transition-colors">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[85vh] flex items-center overflow-hidden bg-slate-900 dark:bg-black text-white px-4">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-slate-900/70 dark:via-black/80 to-slate-900 dark:to-black z-10"></div>
             <img 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=60" 
              alt="Background" 
              className="w-full h-full object-cover opacity-20" 
              fetchPriority="high"
             />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-20 text-center py-8 md:py-20">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 md:px-6 py-2 rounded-full text-green-400 text-[10px] md:text-sm font-black mb-6 animate-pulse mx-auto uppercase tracking-widest">
            <Zap className="w-3 h-3 md:w-4 md:h-4" /> عروض حصرية لفترة محدودة
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-10 leading-tight md:leading-[1.1] tracking-tighter">
            متجر <span className="text-green-500">بريمة</span><br/>قوة الجودة
          </h1>
          <p className="text-sm md:text-2xl text-slate-300 dark:text-gray-400 mb-8 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            الوجهة الأولى في المغرب للإلكترونيات الذكية والمنتجات الفاخرة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 text-black px-10 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl hover:bg-green-400 transition-all transform hover:scale-105 shadow-2xl"
            >
              تسوق الآن
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-16 px-2 gap-4">
            <div className="text-center md:text-right">
                <p className="text-green-600 dark:text-green-500 font-black text-[10px] md:text-sm uppercase tracking-widest mb-2">اختياراتنا لك</p>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white">الأكثر طلباً</h2>
            </div>
            <Link to="/products" className="text-green-600 dark:text-green-500 hover:text-green-400 font-black flex items-center gap-2 group text-sm md:text-lg">
                كل المتجر <ArrowLeft className="h-4 w-4 md:h-6 md:w-6 group-hover:-translate-x-2 transition-transform" />
            </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
            {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold">لا توجد منتجات مميزة حالياً.</div>
            )}
        </div>
      </section>

      {/* Features Bar */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {[
                  { icon: <Truck className="h-8 w-8 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "دفع عند الاستلام", desc: "ادفع فقط بعد معاينة طلبك والتأكد من جودته" },
                  { icon: <ShieldCheck className="h-8 w-8 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "منتجات أصلية", desc: "نضمن لك جودة 100% لكل منتج معروض في المتجر" },
                  { icon: <Headphones className="h-8 w-8 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "دعم متواصل", desc: "فريقنا متاح دائماً عبر الواتساب للإجابة على استفساراتكم" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white dark:bg-[#0a0a0a] p-6 md:p-10 rounded-2xl md:rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center md:flex-col gap-4 md:text-center shadow-md">
                      <div className="bg-green-500/10 p-3 md:p-5 rounded-xl md:rounded-3xl">
                          {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-sm md:text-2xl mb-1 md:mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-gray-500 text-[10px] md:text-base leading-relaxed font-bold">{feature.desc}</p>
                      </div>
                  </div>
                ))}
            </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-100 dark:bg-[#050505] py-12 md:py-24 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
                {homeCategories.map((item, idx) => (
                  <Link key={idx} to={`/products?category=${item.cat}`} className="relative h-[160px] md:h-[450px] rounded-2xl md:rounded-[32px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-xl">
                      <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-transparent to-transparent flex flex-col justify-end p-6 md:p-12">
                          <h3 className="text-white text-xl md:text-4xl font-black mb-1 md:mb-3">{item.title}</h3>
                          <p className="text-green-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
                      </div>
                  </Link>
                ))}
             </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
