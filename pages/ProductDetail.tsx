
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingCart, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
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
      <div className="min-h-[70vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-6">المنتج غير متوفر حالياً</h2>
          <button onClick={() => navigate('/products')} className="bg-green-500 text-black px-10 py-4 rounded-2xl font-black">العودة للمتجر</button>
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
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-500 hover:text-green-500 mb-12 font-black transition-colors group">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> العودة للنتائج
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* المعرض المطور */}
          <div className="space-y-8">
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white/5 bg-[#0a0a0a]">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-all duration-700" />
            </div>
            
            {/* مصغرات الصور */}
            {gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-6">
                 <div className="bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-white/5 hover:border-green-500/20 transition-colors">
                    <Truck className="mx-auto h-8 w-8 text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-gray-400 uppercase tracking-widest">توصيل مجاني</span>
                 </div>
                 <div className="bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-white/5 hover:border-green-500/20 transition-colors">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-gray-400 uppercase tracking-widest">جودة مضمونة</span>
                 </div>
                 <div className="bg-[#0a0a0a] p-8 rounded-[32px] text-center border border-white/5 hover:border-green-500/20 transition-colors">
                    <ShieldCheck className="mx-auto h-8 w-8 text-green-500 mb-4" />
                    <span className="text-[10px] font-black block text-gray-400 uppercase tracking-widest">دفع آمن</span>
                 </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="inline-block bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 w-fit">
                {product.category}
            </div>
            <h1 className="text-5xl font-black text-white mb-8 leading-[1.2]">{product.title}</h1>
            
            <div className="flex items-center gap-8 mb-12 bg-[#0a0a0a] p-8 rounded-[32px] border border-white/5 w-fit shadow-xl">
              <span className="text-5xl font-black text-green-500">{product.price} <span className="text-lg">د.م</span></span>
              {product.oldPrice && <span className="text-2xl text-gray-600 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>

            <p className="text-gray-400 leading-relaxed mb-12 text-2xl font-medium opacity-80">{product.description}</p>

            <div className="mb-14 bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5">
              <h3 className="font-black text-white mb-8 text-2xl flex items-center gap-3">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  المميزات الأساسية
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="bg-green-500/10 p-1.5 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="text-gray-300 font-bold group-hover:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-4 pt-10 border-t border-white/5">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-green-500 text-black py-7 rounded-[32px] font-black text-2xl hover:bg-green-400 shadow-2xl shadow-green-500/20 flex flex-col items-center justify-center group active:scale-95 transition-all"
              >
                اطلب الآن - الدفع عند الاستلام
                <span className="text-xs opacity-70 mt-2 font-bold uppercase tracking-widest">توصيل منزلي مجاني 100%</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;