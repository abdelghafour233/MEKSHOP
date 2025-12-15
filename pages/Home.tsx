import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useProducts();
  
  // Get 3 random products for "Featured"
  const featuredProducts = products.slice(0, 3);
  const newArrivals = products.slice(3, 7);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            أفضل العروض في <span className="text-amber-500">المغرب</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            تسوق الإلكترونيات، مستلزمات المنزل، وإكسسوارات السيارات بأفضل الأسعار. الدفع عند الاستلام.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-amber-500 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all transform hover:scale-105 shadow-lg"
          >
            تصفح المنتجات
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">
                <div className="flex flex-col items-center p-4">
                    <Truck className="h-10 w-10 text-blue-600 mb-3" />
                    <h3 className="font-bold text-lg mb-1">دفع عند الاستلام</h3>
                    <p className="text-gray-500 text-sm">ادفع فقط عندما يصلك طلبك</p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
                    <h3 className="font-bold text-lg mb-1">منتجات أصلية</h3>
                    <p className="text-gray-500 text-sm">نضمن لك جودة عالية لجميع المنتجات</p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <Headphones className="h-10 w-10 text-blue-600 mb-3" />
                    <h3 className="font-bold text-lg mb-1">دعم فني</h3>
                    <p className="text-gray-500 text-sm">فريقنا جاهز لمساعدتك طوال الأسبوع</p>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">الأكثر مبيعاً</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Categories Banner */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">تسوق حسب الفئة</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/products?category=electronics" className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1498049384371-061895450719?auto=format&fit=crop&w=800&q=80" alt="Electronics" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <h3 className="text-white text-2xl font-bold">إلكترونيات</h3>
                    </div>
                </Link>
                <Link to="/products?category=home" className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" alt="Home" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <h3 className="text-white text-2xl font-bold">المنزل والمطبخ</h3>
                    </div>
                </Link>
                <Link to="/products?category=cars" className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" alt="Cars" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <h3 className="text-white text-2xl font-bold">السيارات</h3>
                    </div>
                </Link>
             </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">وصل حديثاً</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;