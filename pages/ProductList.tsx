
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
    { id: Category.HOME, name: 'المنزل' },
    { id: Category.CARS, name: 'السيارات' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-10 md:py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
            <div className="inline-block px-5 py-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 border border-green-500/20">
                تصفح الكتالوج
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">منتجات berrima store</h1>
            <p className="text-slate-500 dark:text-gray-500 max-w-xl mx-auto font-bold text-sm md:text-base px-4">ننتقي لك الأفضل بعناية فائقة. ابحث عن فئتك المفضلة وابدأ التسوق.</p>
        </div>

        {/* Custom Filters - Responsive Scrollable on Mobile */}
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-3 md:gap-4 mb-12 md:mb-20 pb-4 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
              className={`flex-shrink-0 px-8 md:px-10 py-3.5 md:py-4 rounded-2xl md:rounded-[24px] font-black transition-all border text-base md:text-lg ${
                (cat.id === 'all' && !categoryFilter) || categoryFilter === cat.id
                ? 'bg-green-600 dark:bg-green-500 text-white dark:text-black border-green-600 dark:border-green-500 shadow-xl shadow-green-500/20' 
                : 'bg-white dark:bg-[#0a0a0a] text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/5'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid - 1 col on mobile, 2 on sm, 4 on lg */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-40 bg-white dark:bg-[#0a0a0a] rounded-[32px] md:rounded-[48px] border border-slate-200 dark:border-white/5 shadow-2xl mx-4">
            <p className="text-slate-400 dark:text-gray-500 text-xl md:text-2xl font-black">عذراً، لا توجد منتجات حالياً.</p>
            <Link to="/products" className="text-green-600 dark:text-green-500 hover:underline mt-6 inline-block font-black text-lg">تصفح الكل</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
