import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingCart, Truck, Star, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-100 mb-4">المنتج غير متوفر حالياً</h2>
          <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all">
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  const handleOrderNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="bg-slate-950 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb-like back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-100 mb-10 font-bold transition-colors">
            <ArrowRight className="w-5 h-5" /> العودة للنتائج
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Image Container */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <Truck className="mx-auto h-8 w-8 text-blue-500 mb-3" />
                    <span className="text-xs font-black block text-slate-300">توصيل منزلي</span>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-3" />
                    <span className="text-xs font-black block text-slate-300">جودة مضمونة</span>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <Star className="mx-auto h-8 w-8 text-amber-500 mb-3" />
                    <span className="text-xs font-black block text-slate-300">الأفضل مبيعاً</span>
                 </div>
            </div>
          </div>

          {/* Product Detail Info */}
          <div className="flex flex-col">
            <div className="inline-block px-4 py-1.5 bg-blue-900/30 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 w-fit">
                {product.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-100 mb-8 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-6 mb-10 bg-slate-900 p-6 rounded-3xl border border-slate-800 w-fit">
              <span className="text-4xl font-black text-amber-500">{product.price} <span className="text-lg">د.م</span></span>
              {product.oldPrice && (
                <span className="text-2xl text-slate-500 line-through font-bold">{product.oldPrice} د.م</span>
              )}
              {product.oldPrice && (
                 <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-sm font-black">وفر {(product.oldPrice - product.price)} د.م</span>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-slate-400 leading-relaxed mb-10 text-xl font-light">
                {product.description}
                </p>
            </div>

            {/* Feature List */}
            <div className="mb-12 bg-slate-900/50 p-8 rounded-[32px] border border-slate-800">
              <h3 className="font-black text-slate-100 mb-6 text-xl">لماذا تختار هذا المنتج؟</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-500/20 rounded-lg mt-1"><CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" /></div>
                    <span className="text-slate-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fixed Bottom Action Mobile / Normal Desktop */}
            <div className="mt-auto space-y-4 pt-10 border-t border-slate-800">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-4 group"
              >
                اطلب الآن - الدفع عند الاستلام
                <Truck className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => { addToCart(product); alert('تمت الإضافة للسلة بنجاح!'); }}
                className="w-full bg-slate-900 text-slate-100 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all border border-slate-800 flex items-center justify-center gap-3"
              >
                إضافة إلى السلة
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;