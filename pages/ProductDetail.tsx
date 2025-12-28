
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
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
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">المنتج غير متوفر حالياً</h2>
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
    <div className="bg-slate-50 dark:bg-black min-h-screen py-8 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-500 mb-8 md:mb-12 font-black transition-colors group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> العودة
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          
          {/* Gallery Area */}
          <div className="space-y-6 md:space-y-8">
            <div className="aspect-square md:aspect-[4/3] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            
            {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:gap-4 md:pb-0">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`flex-shrink-0 w-20 h-20 md:w-auto md:h-auto md:aspect-square rounded-xl md:rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-green-600 dark:border-green-500 scale-105' : 'border-slate-200 dark:border-white/5 opacity-50'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6">
                 {[
                   { icon: <Truck className="h-6 w-6 md:h-8 md:w-8" />, label: "توصيل مجاني" },
                   { icon: <CheckCircle className="h-6 w-6 md:h-8 md:w-8" />, label: "جودة مضمونة" },
                   { icon: <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" />, label: "دفع آمن" }
                 ].map((item, i) => (
                   <div key={i} className="bg-white dark:bg-[#0a0a0a] p-4 md:p-8 rounded-2xl md:rounded-[32px] text-center border border-slate-200 dark:border-white/5 shadow-sm">
                      <div className="text-green-600 dark:text-green-500 mb-2 md:mb-4 flex justify-center">{item.icon}</div>
                      <span className="text-[8px] md:text-[10px] font-black block text-slate-500 dark:text-gray-400 uppercase tracking-widest leading-tight">{item.label}</span>
                   </div>
                 ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="inline-block bg-green-500/10 text-green-600 dark:text-green-500 px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6 w-fit border border-green-500/20">
                {product.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-6 md:gap-8 mb-8 md:mb-12 bg-white dark:bg-[#0a0a0a] p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-slate-200 dark:border-white/5 w-full md:w-fit shadow-xl">
              <span className="text-4xl md:text-5xl font-black text-green-600 dark:text-green-500">{product.price} <span className="text-lg">د.م</span></span>
              {product.oldPrice && <span className="text-xl md:text-2xl text-slate-400 dark:text-gray-600 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-3xl md:rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm mb-10 md:mb-14">
              <h3 className="font-black text-slate-900 dark:text-white mb-6 md:mb-8 text-xl md:text-2xl flex items-center gap-3">
                  <div className="w-1.5 md:w-2 h-6 md:h-8 bg-green-600 dark:bg-green-500 rounded-full"></div>
                  وصف المنتج
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/5">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-6 md:py-7 rounded-2xl md:rounded-[32px] font-black text-xl md:text-2xl hover:bg-green-500 dark:hover:bg-green-400 shadow-2xl shadow-green-500/20 flex flex-col items-center justify-center group active:scale-95 transition-all"
              >
                اطلب الآن - الدفع عند الاستلام
                <span className="text-[10px] md:text-xs opacity-70 mt-1 md:mt-2 font-bold uppercase tracking-widest">توصيل منزلي مجاني وسريع</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
