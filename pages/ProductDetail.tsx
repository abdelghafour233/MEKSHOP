
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState<string>(product?.imageUrl || '');

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">المنتج غير متوفر حالياً</h2>
          <button onClick={() => navigate('/products')} className="bg-green-600 dark:bg-green-500 text-white dark:text-black px-10 py-4 rounded-2xl font-black">العودة للمتجر</button>
        </div>
      </div>
    );
  }

  const handleOrderNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const gallery = [product.imageUrl, ...(product.additionalImages || [])];

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-500 mb-12 font-black transition-colors group">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> العودة للنتائج
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* المعرض المطور */}
          <div className="space-y-8">
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-all duration-700" />
            </div>
            
            {/* مصغرات الصور */}
            {gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-green-600 dark:border-green-500 scale-105 shadow-lg shadow-green-500/20' : 'border-slate-200 dark:border-white/5 opacity-40 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-6">
                 <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-slate-200 dark:border-white/5 hover:border-green-500/20 transition-colors shadow-sm">
                    <Truck className="mx-auto h-8 w-8 text-green-600 dark:text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-slate-500 dark:text-gray-400 uppercase tracking-widest">توصيل مجاني</span>
                 </div>
                 <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-slate-200 dark:border-white/5 hover:border-green-500/20 transition-colors shadow-sm">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-600 dark:text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-slate-500 dark:text-gray-400 uppercase tracking-widest">جودة مضمونة</span>
                 </div>
                 <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-slate-200 dark:border-white/5 hover:border-green-500/20 transition-colors shadow-sm">
                    <ShieldCheck className="mx-auto h-8 w-8 text-green-600 dark:text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-slate-500 dark:text-gray-400 uppercase tracking-widest">دفع آمن</span>
                 </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="inline-block bg-green-500/10 text-green-600 dark:text-green-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 w-fit border border-green-500/20">
                {product.category}
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-8 leading-[1.2]">{product.title}</h1>
            
            <div className="flex items-center gap-8 mb-12 bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 w-fit shadow-xl">
              <span className="text-5xl font-black text-green-600 dark:text-green-500">{product.price} <span className="text-lg">د.م</span></span>
              {product.oldPrice && <span className="text-2xl text-slate-400 dark:text-gray-600 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm mb-14">
              <h3 className="font-black text-slate-900 dark:text-white mb-8 text-2xl flex items-center gap-3">
                  <div className="w-2 h-8 bg-green-600 dark:bg-green-500 rounded-full"></div>
                  وصف المنتج
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-xl font-medium whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mt-auto space-y-4 pt-10 border-t border-slate-200 dark:border-white/5">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-7 rounded-[32px] font-black text-2xl hover:bg-green-500 dark:hover:bg-green-400 shadow-2xl shadow-green-500/20 flex flex-col items-center justify-center group active:scale-95 transition-all"
              >
                اطلب الآن - الدفع عند الاستلام
                <span className="text-xs opacity-70 mt-2 font-bold uppercase tracking-widest">توصيل منزلي مجاني لجميع المدن</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
