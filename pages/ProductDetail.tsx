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
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-100 mb-4">المنتج غير متوفر حالياً</h2>
          <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">العودة للمتجر</button>
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
    <div className="bg-slate-950 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-100 mb-10 font-bold">
            <ArrowRight className="w-5 h-5" /> العودة للنتائج
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* المعرض المطور */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-all duration-500" />
            </div>
            
            {/* مصغرات الصور */}
            {gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-amber-500 scale-105 shadow-lg' : 'border-slate-800 opacity-60'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-6 pt-4">
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <Truck className="mx-auto h-8 w-8 text-amber-500 mb-3" />
                    <span className="text-[10px] font-black block text-slate-300">توصيل مجاني</span>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-3" />
                    <span className="text-[10px] font-black block text-slate-300">جودة مضمونة</span>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-3xl text-center border border-slate-800">
                    <ShieldCheck className="mx-auto h-8 w-8 text-blue-500 mb-3" />
                    <span className="text-[10px] font-black block text-slate-300">دفع عند الاستلام</span>
                 </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-100 mb-6">{product.title}</h1>
            
            <div className="flex items-center gap-6 mb-10 bg-slate-900 p-6 rounded-3xl border border-slate-800 w-fit">
              <span className="text-4xl font-black text-amber-500">{product.price} د.م</span>
              {product.oldPrice && <span className="text-2xl text-slate-500 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>

            <p className="text-slate-400 leading-relaxed mb-10 text-xl font-light">{product.description}</p>

            <div className="mb-12 bg-slate-900/50 p-8 rounded-[32px] border border-slate-800">
              <h3 className="font-black text-slate-100 mb-6 text-xl">المميزات:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-4 pt-10 border-t border-slate-800">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 shadow-2xl flex flex-col items-center justify-center group"
              >
                اطلب الآن - الدفع عند الاستلام
                <span className="text-[10px] opacity-70 mt-1">توصيل منزلي مجاني 100%</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;