
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, Timer, Zap, MessageCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ShareButtons from '../components/ShareButtons';
import { WHATSAPP_NUMBER } from '../constants';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(products.find((p) => p.id === id));
  const [activeImage, setActiveImage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.imageUrl);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-black mb-4">عذراً، المنتج غير موجود</h2>
        <Link to="/products" className="text-green-600 font-bold flex items-center gap-2">
          <ArrowRight size={20} /> العودة للمتجر
        </Link>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const text = `السلام عليكم، أريد طلب منتج: ${product.title}\nالسعر: ${product.price} د.م\nالرابط: ${window.location.href}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOrderNow = () => { 
    addToCart(product); 
    navigate('/checkout'); 
  };

  const gallery = [product.imageUrl, ...(product.additionalImages || [])];

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen pb-32 lg:pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-green-500 mb-8 font-bold transition-colors">
            <ArrowRight className="w-5 h-5" /> العودة
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 group">
              <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {product.oldPrice && (
                <div className="absolute top-6 right-6 bg-red-600 text-white px-5 py-2 rounded-full font-black text-xs shadow-xl animate-pulse z-10">
                  تخفيض {Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}%
                </div>
              )}
            </div>
            
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)} 
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`عرض ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-5 rounded-3xl flex items-center justify-between border border-amber-500/20 shadow-sm">
               <div className="flex items-center gap-3 font-black text-sm md:text-base">
                 <Timer size={20} className="animate-spin-slow" /> عرض محدود ينتهي خلال:
               </div>
               <div className="font-mono font-black text-lg md:text-xl" dir="ltr">
                 {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
               </div>
            </div>

            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">{product.category}</span>
              <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">{product.title}</h1>
              
              <div className="flex items-center gap-6 pt-2">
                <span className="text-4xl md:text-6xl font-black text-green-600 dark:text-green-500">{product.price} <small className="text-xl">د.م</small></span>
                {product.oldPrice && (
                  <span className="text-2xl text-slate-400 line-through font-bold">{product.oldPrice} د.م</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-red-500 font-black text-sm md:text-base bg-red-500/5 p-3 rounded-xl inline-flex border border-red-500/10">
                <Zap size={18} fill="currentColor" /> متوفر حالياً 5 قطع فقط في المخزون!
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                  وصف المنتج
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                  {product.description}
                </p>
                
                {product.features && product.features.length > 0 && (
                  <ul className="mt-8 space-y-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 font-bold text-slate-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center gap-4">
                  <Truck className="text-green-600" size={32} />
                  <div>
                    <p className="font-black text-sm">توصيل سريع</p>
                    <p className="text-xs text-slate-500">لجميع المدن المغربية</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center gap-4">
                  <ShieldCheck className="text-green-600" size={32} />
                  <div>
                    <p className="font-black text-sm">دفع عند الاستلام</p>
                    <p className="text-xs text-slate-500">ثقة وأمان 100%</p>
                  </div>
               </div>
            </div>

            <ShareButtons url={window.location.href} title={product.title} />
          </div>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-[100] lg:hidden">
        <div className="flex gap-3">
          <button 
            onClick={handleWhatsAppOrder}
            className="flex-1 bg-green-500 text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-green-500/20"
          >
            <MessageCircle size={20} /> اطلب واتساب
          </button>
          <button 
            onClick={handleOrderNow}
            className="flex-[1.5] bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl"
          >
            <ShoppingCart size={20} /> اشتري الآن
          </button>
        </div>
      </div>
      
      {/* Desktop Purchase Buttons */}
      <div className="hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-700">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl p-3 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-3xl flex gap-4 items-center px-6">
            <div className="flex flex-col ml-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">السعر النهائي</span>
              <span className="text-2xl font-black text-green-600">{product.price} د.م</span>
            </div>
            <button 
              onClick={handleWhatsAppOrder}
              className="bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all"
            >
              <MessageCircle size={22} /> اطلب عبر واتساب
            </button>
            <button 
              onClick={handleOrderNow}
              className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-green-600/20 hover:scale-105 transition-all"
            >
              <ShoppingCart size={22} /> أضف للسلة وأكمل الطلب
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
