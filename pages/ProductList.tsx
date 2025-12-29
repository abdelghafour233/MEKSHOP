
import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Category } from '../types';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const ProductList: React.FC = () => {
  const { products } = useProducts();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [categoryFilter, products]);

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: Category.ELECTRONICS, name: 'إلكترونيات' },
    { id: Category.CAR_ACCESSORIES, name: 'إكسسوارات سيارات' },
    { id: Category.WATCHES, name: 'ساعات' },
    { id: Category.GLASSES, name: 'نظارات' },
    { id: Category.OTHER, name: 'أخرى' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-10 md:py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-8 md:mb-16">
            <div className="inline-block px-4 py-1.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 border border-green-500/20">
                تصفح الكتالوج
            </div>
            <h1 className="text-2xl md:text-6xl font-black text-slate-900 dark:text-white mb-3 md:mb-6">منتجات berrima store</h1>
            <p className="text-slate-500 dark:text-gray-500 max-w-xl mx-auto font-bold text-xs md:text-base px-4">ننتقي لك الأفضل بعناية فائقة من جميع الأصناف.</p>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-2 md:gap-4 mb-8 md:mb-20 pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
              className={`flex-shrink-0 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[24px] font-black transition-all border text-xs md:text-lg whitespace-nowrap ${
                (cat.id === 'all' && !categoryFilter) || categoryFilter === cat.id
                ? 'bg-green-600 dark:bg-green-500 text-white dark:text-black border-green-600 shadow-lg' 
                : 'bg-white dark:bg-[#0a0a0a] text-slate-500 border-slate-200 dark:border-white/5'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid: 2 columns on mobile, 4 on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl mx-2">
            <p className="text-slate-400 dark:text-gray-500 text-lg md:text-2xl font-black">عذراً، لا توجد منتجات حالياً.</p>
            <Link to="/products" className="text-green-600 font-black mt-4 inline-block text-sm md:text-lg">تصفح الكل</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
