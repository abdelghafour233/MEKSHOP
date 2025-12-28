
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
    { cat: 'watches', title: 'ساعات', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="space-y-12 md:space-y-24 pb-20 transition-colors duration-500 bg-slate-50 dark:bg-black">
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-slate-900 dark:bg-black text-white px-4">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-slate-900/80 dark:via-black/80 to-slate-900 dark:to-black z-10"></div>
             <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 md:px-6 py-2 rounded-full text-green-400 text-xs md:text-sm font-black mb-6 md:mb-10 animate-pulse mx-auto">
            <Zap className="w-4 h-4" /> عروض حصرية لفترة محدودة
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-10 leading-[1.1] tracking-tighter">
            متجر <span className="text-green-500">بريمة</span><br/>قوة الجودة
          </h1>
          <p className="text-base md:text-2xl text-slate-300 dark:text-gray-400 mb-8 md:mb-14 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            الوجهة الأولى في المغرب للإلكترونيات الذكية، الساعات الفاخرة، وإكسسوارات السيارات الفاخرة. جودة تليق بك ودفع عند الاستلام.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 text-black px-10 md:px-14 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl hover:bg-green-400 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/20"
            >
              تسوق الآن
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 px-10 md:px-14 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl hover:bg-white/20 transition-all"
            >
              الأحدث
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  { icon: <Truck className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "دفع عند الاستلام", desc: "أمان تام، ادفع فقط بعد معاينة طلبك والتأكد من جودته" },
                  { icon: <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "منتجات أصلية", desc: "نحن في berrima store نضمن لك جودة 100% لكل منتج معروض" },
                  { icon: <Headphones className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-500" />, title: "دعم متواصل", desc: "فريقنا متاح دائماً عبر الواتساب للإجابة على جميع استفساراتكم" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:border-green-500/30 transition-all duration-500 shadow-xl">
                      <div className="bg-green-500/10 p-4 md:p-5 rounded-2xl md:rounded-3xl mb-6 md:mb-8 group-hover:scale-110 transition-all">
                          {feature.icon}
                      </div>
                      <h3 className="font-black text-xl md:text-2xl mb-3 md:mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                      <p className="text-slate-500 dark:text-gray-500 text-sm md:text-base leading-relaxed font-bold">{feature.desc}</p>
                  </div>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-16 gap-4">
            <div className="text-center md:text-right">
                <p className="text-green-600 dark:text-green-500 font-black text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-4">اختياراتنا لك</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">الأكثر طلباً</h2>
            </div>
            <Link to="/products" className="text-green-600 dark:text-green-500 hover:text-green-400 font-black flex items-center gap-2 group text-base md:text-lg bg-green-500/5 px-6 py-3 rounded-full md:bg-transparent md:p-0 transition-all">
                كل المتجر <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 group-hover:-translate-x-2 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-100 dark:bg-[#050505] py-16 md:py-24 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">تصفح أقسامنا</h2>
                <p className="text-slate-500 dark:text-gray-500 mt-4 md:mt-6 text-lg md:text-xl">كل ما تحتاجه في مكان واحد</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                {homeCategories.map((item, idx) => (
                  <Link key={idx} to={`/products?category=${item.cat}`} className="relative h-[300px] md:h-[450px] rounded-[32px] md:rounded-[48px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-2xl">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 dark:opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-slate-900/20 dark:via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                          <h3 className="text-white text-3xl md:text-4xl font-black mb-2 md:mb-3">{item.title}</h3>
                          <p className="text-green-400 dark:text-green-500 text-xs md:text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
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
