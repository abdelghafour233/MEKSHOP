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
    { id: 'all', name: 'الكل', label: 'All' },
    { id: Category.ELECTRONICS, name: 'إلكترونيات', label: 'Electronics' },
    { id: Category.HOME, name: 'المنزل', label: 'Home' },
    { id: Category.CARS, name: 'السيارات', label: 'Cars' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">منتجاتنا</h1>
          <p className="text-gray-500">اختر من مجموعتنا الواسعة من المنتجات عالية الجودة</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link 
            to="/products"
            className={`px-6 py-2 rounded-full border transition-all ${!categoryFilter 
              ? 'bg-blue-900 text-white border-blue-900' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-900 hover:text-blue-900'}`}
          >
            الكل
          </Link>
          <Link 
            to={`/products?category=${Category.ELECTRONICS}`}
            className={`px-6 py-2 rounded-full border transition-all ${categoryFilter === Category.ELECTRONICS 
              ? 'bg-blue-900 text-white border-blue-900' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-900 hover:text-blue-900'}`}
          >
            إلكترونيات
          </Link>
          <Link 
            to={`/products?category=${Category.HOME}`}
            className={`px-6 py-2 rounded-full border transition-all ${categoryFilter === Category.HOME 
              ? 'bg-blue-900 text-white border-blue-900' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-900 hover:text-blue-900'}`}
          >
            المنزل
          </Link>
          <Link 
            to={`/products?category=${Category.CARS}`}
            className={`px-6 py-2 rounded-full border transition-all ${categoryFilter === Category.CARS 
              ? 'bg-blue-900 text-white border-blue-900' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-900 hover:text-blue-900'}`}
          >
            السيارات
          </Link>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">لا توجد منتجات في هذه الفئة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;