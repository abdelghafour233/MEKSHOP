
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Headphones, Zap, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Category } from '../types';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  const homeCategories = [
    { cat: Category.ELECTRONICS, title: 'إلكترونيات ذكية', img: 'https://images.unsplash.com/photo-1498049384371-061895450719?auto=format&fit=crop&w=800&q=80' },
    { cat: Category.CAR_ACCESSORIES, title: 'إكسسوارات سيارات', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' },
    { cat: Category.GLASSES, title: 'نظارات ذكية', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="space-y-12 md:space-y-24 pb-20 bg-slate-50 dark:bg-black transition-colors">
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[85vh] flex items-center overflow-hidden bg-slate-900 dark:bg-black text-white px-4">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-slate-900/80 dark:via-black/90 to-slate-900 dark:to-black z-10"></div>
             <img 
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80" 
              alt="Background" 
              className="w-full h-full object-cover opacity-30" 
              fetchPriority="high"
             />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-20 text-center py-8 md:py-20">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 md:px-6 py-2 rounded-full text-green-400 text-[10px] md:text-sm font-black mb-6 animate-pulse mx-auto uppercase tracking-widest">
            <Truck className="w-3 h-3 md:w-4 md:h-4" /> توصيل منزلي مجاني لجميع المدن
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-10 leading-tight md:leading-[1.1] tracking-tighter">
            متجر <span className="text-green-500">بريمة</span><br/>جودة مضمونة
          </h1>
          <p className="text-sm md:text-2xl text-slate-300 dark:text-gray-400 mb-8 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            تسوق أفضل المنتجات الإلكترونية والمنزلية في المغرب. الدفع عند الاستلام بعد التأكد من الجودة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 text-black px-10 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl hover:bg-green-400 transition-all transform hover:scale-105 shadow-2xl"
            >
              عرض الكتالوج
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="px-4 -mt-10 md:-mt-20 relative z-30">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {[
                  { icon: <Truck className="h-8 w-8 text-green-600 dark:text-green-500" />, title: "توصيل سريع", desc: "نصلك أينما كنت في المغرب خلال 24 إلى 48 ساعة" },
                  { icon: <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-500" />, title: "الدفع عند الاستلام", desc: "افحص طلبك وتأكد منه قبل دفع أي درهم" },
                  { icon: <Star className="h-8 w-8 text-green-600 dark:text-green-500" />, title: "جودة ممتازة", desc: "نختار منتجاتنا بعناية فائقة لضمان رضاكم التام" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white dark:bg-[#0a0a0a] p-6 md:p-10 rounded-2xl md:rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center md:flex-col gap-4 md:text-center shadow-2xl">
                      <div className="bg-green-500/10 p-3 md:p-5 rounded-xl md:rounded-3xl shrink-0">
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
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 md:mb-16 text-center">أقسام المتجر</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
          {homeCategories.map((item, idx) => (
            <Link key={idx} to={`/products?category=${item.cat}`} className="relative h-[180px] md:h-[450px] rounded-2xl md:rounded-[32px] overflow-hidden group border border-slate-200 dark:border-white/5 shadow-xl">
                <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-transparent to-transparent flex flex-col justify-end p-6 md:p-12">
                    <h3 className="text-white text-xl md:text-4xl font-black mb-1 md:mb-3">{item.title}</h3>
                    <p className="text-green-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">اكتشف الآن</p>
                </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 bg-slate-100 dark:bg-white/5 py-12 md:py-24 rounded-[40px] md:rounded-[80px]">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-16 px-6 gap-4">
            <div className="text-center md:text-right">
                <p className="text-green-600 dark:text-green-500 font-black text-[10px] md:text-sm uppercase tracking-widest mb-2">الأكثر مبيعاً</p>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white">منتجات مختارة لك</h2>
            </div>
            <Link to="/products" className="text-green-600 dark:text-green-500 hover:text-green-400 font-black flex items-center gap-2 group text-sm md:text-lg">
                شاهد الكل <ArrowLeft className="h-4 w-4 md:h-6 md:w-6 group-hover:-translate-x-2 transition-transform" />
            </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 px-2">
            {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold">جاري تحميل المنتجات...</div>
            )}
        </div>
      </section>
      
      {/* Testimonials / Trust */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h2 className="text-2xl md:text-4xl font-black">لماذا يثق بنا آلاف الزبائن؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            {[
                { name: "ياسين، الدار البيضاء", text: "صراحة النظارات جاو واعرين، والتوصيل كان سريع جداً. شكراً بريمة ستور." },
                { name: "سناء، طنجة", text: "الساعة Ultra اللي خديت زوينة بزاف وكتحمق، والدفع عند الاستلام خلاني نتيق أكثر." }
            ].map((t, i) => (
                <div key={i} className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex gap-1 text-amber-500 mb-4"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                    <p className="text-slate-600 dark:text-gray-400 font-bold mb-4 italic">"{t.text}"</p>
                    <p className="font-black text-sm text-green-600">{t.name}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
