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
    <div className="bg-slate-950 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-900/30 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                تصفح الكتالوج
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-6">منتجات berrima store</h1>
            <p className="text-slate-500 max-w-xl mx-auto">ننتقي لك الأفضل بعناية فائقة. ابحث عن فئتك المفضلة وابدأ التسوق.</p>
        </div>

        {/* Custom Dark Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
              className={`px-8 py-3 rounded-2xl font-bold transition-all border ${
                (cat.id === 'all' && !categoryFilter) || categoryFilter === cat.id
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl shadow-amber-500/10' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-100'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-900 rounded-[40px] border border-slate-800">
            <p className="text-slate-500 text-xl font-bold">عذراً، لا توجد منتجات في هذا القسم حالياً.</p>
            <Link to="/products" className="text-amber-500 hover:underline mt-4 inline-block font-black">العودة لتصفح الكل</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;