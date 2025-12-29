
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ShareButtons from '../components/ShareButtons';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState<string>(product?.imageUrl || '');

  useEffect(() => {
    if (product) {
      document.title = `${product.title} - ${product.price} د.م | berrima store`;
      
      // SEO: Product Schema Injection
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": [product.imageUrl, ...(product.additionalImages || [])],
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "berrima store"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "MAD",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      script.id = 'product-schema';
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById('product-schema');
        if (existingScript) existingScript.remove();
      };
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center px-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">المنتج غير متوفر حالياً</h2>
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
  const currentUrl = window.location.href;

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-gray-500 hover:text-green-600 mb-8 font-black transition-colors group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> العودة
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          
          <div className="space-y-6 md:space-y-8">
            <div className="aspect-square md:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            
            {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:gap-4 md:pb-0">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`flex-shrink-0 w-20 h-20 md:w-auto md:h-auto md:aspect-square rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-green-600' : 'border-slate-200 dark:border-white/5 opacity-50'}`}
                        >
                            <img src={img} alt={`${product.title} gallery ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4">
                 {[
                   { icon: <Truck className="h-6 w-6" />, label: "توصيل مجاني" },
                   { icon: <CheckCircle className="h-6 w-6" />, label: "جودة مضمونة" },
                   { icon: <ShieldCheck className="h-6 w-6" />, label: "دفع آمن" }
                 ].map((item, i) => (
                   <div key={i} className="bg-white dark:bg-[#0a0a0a] p-4 rounded-[24px] text-center border border-slate-200 dark:border-white/5 shadow-sm">
                      <div className="text-green-600 dark:text-green-500 mb-2 flex justify-center">{item.icon}</div>
                      <span className="text-[8px] font-black block text-slate-500 dark:text-gray-400 uppercase tracking-widest leading-tight">{item.label}</span>
                   </div>
                 ))}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="inline-block bg-green-500/10 text-green-600 dark:text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit border border-green-500/20">
                {product.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-6 mb-8 bg-white dark:bg-[#0a0a0a] p-6 rounded-[32px] border border-slate-200 dark:border-white/5 w-fit shadow-xl">
              <span className="text-4xl font-black text-green-600 dark:text-green-500">{product.price} <span className="text-lg">د.م</span></span>
              {product.oldPrice && <span className="text-xl text-slate-400 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm mb-10">
              <h2 className="font-black text-slate-900 dark:text-white mb-6 text-xl flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                  مميزات المنتج
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg font-medium whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mt-auto space-y-12">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-7 rounded-[32px] font-black text-2xl hover:bg-green-500 transition-all shadow-2xl shadow-green-500/30 flex flex-col items-center justify-center group active:scale-95 border-b-4 border-green-800 dark:border-green-700"
              >
                اطلب الآن - الدفع عند الاستلام
                <span className="text-[10px] opacity-70 mt-1 font-bold uppercase tracking-widest">توصيل منزلي مجاني وسريع 🚚</span>
              </button>

              <div className="bg-slate-100 dark:bg-[#0a0a0a] p-10 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-inner">
                <ShareButtons url={currentUrl} title={product.title} image={product.imageUrl} variant="large" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
