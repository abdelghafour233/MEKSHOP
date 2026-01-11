
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, CheckCircle, AlertTriangle, Home, DownloadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ShareButtons from '../components/ShareButtons';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, importProducts } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(products.find((p) => p.id === id));
  const [activeImage, setActiveImage] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      if (!activeImage) setActiveImage(foundProduct.imageUrl);
    } else {
      const params = new URLSearchParams(location.search);
      const encodedData = params.get('pdata');
      if (encodedData) {
        try {
          setIsImporting(true);
          const decodedData = JSON.parse(atob(encodedData));
          if (decodedData && decodedData.id === id) {
            importProducts(JSON.stringify([decodedData]));
            setProduct(decodedData);
            setActiveImage(decodedData.imageUrl);
          }
        } catch (e) {
          console.error("Failed to decode magic link", e);
        } finally {
          setIsImporting(false);
        }
      }
    }
  }, [id, products, location.search, importProducts]);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} - ${product.price} د.م | berrima store`;
    }
  }, [product]);

  if (isImporting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-black">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4">
        <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-[#0a0a0a] p-12 rounded-[48px] shadow-3xl border border-slate-200 dark:border-white/5 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <AlertTriangle size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">المنتج غير متوفر حالياً</h2>
            <p className="text-slate-500 dark:text-gray-500 font-bold leading-relaxed">
                هذا المنتج قد تم حذفه أو تم تغيير الرابط الخاص به.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
              <Link to="/products" className="bg-green-600 dark:bg-green-500 text-white dark:text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> العودة للمتجر
              </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleOrderNow = () => { addToCart(product); navigate('/checkout'); };
  const gallery = [product.imageUrl, ...(product.additionalImages || [])];
  const productUrl = window.location.href;

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-6 md:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-green-500 mb-8 font-black transition-colors group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> العودة للتسوق
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Gallery Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="relative aspect-square rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] group">
              <img 
                src={activeImage || product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {gallery.length > 1 && (
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
                    {gallery.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${activeImage === gallery[i] ? 'w-8 bg-green-500' : 'w-2 bg-white/40'}`}></div>
                    ))}
                </div>
              )}
            </div>

            {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {gallery.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)} 
                            className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 overflow-hidden transition-all transform active:scale-90 ${activeImage === img ? 'border-green-600 scale-105 shadow-lg' : 'border-slate-200 dark:border-white/5 opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} alt={`${product.title} view ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full space-y-8">
            <div>
                <div className="inline-block bg-green-500/10 text-green-600 dark:text-green-500 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 border border-green-500/20">{product.category}</div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{product.title}</h1>
                
                <div className="flex items-center gap-6 mb-8 bg-white dark:bg-[#0a0a0a] p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-200 dark:border-white/5 w-fit shadow-2xl shadow-green-500/5">
                  <div className="flex flex-col">
                    <span className="text-4xl md:text-6xl font-black text-green-600 dark:text-green-500 tracking-tighter">{product.price} <span className="text-xl md:text-2xl font-bold">د.م</span></span>
                    {product.oldPrice && <span className="text-xl text-slate-400 line-through font-bold">{product.oldPrice} د.م</span>}
                  </div>
                  {product.oldPrice && (
                    <div className="bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-black animate-bounce shadow-lg shadow-rose-500/20">وفر {(product.oldPrice - product.price)} د.م</div>
                  )}
                </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm">
              <h2 className="font-black text-slate-900 dark:text-white mb-6 text-xl flex items-center gap-3">
                <div className="w-1.5 h-6 bg-green-600 rounded-full"></div> 
                تفاصيل المنتج
              </h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg font-medium whitespace-pre-line">{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-gray-300 font-bold text-sm">
                            <CheckCircle size={18} className="text-green-500" />
                            {feat}
                        </div>
                    ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-6 md:static z-40 px-2 md:px-0">
                <button 
                    onClick={handleOrderNow} 
                    className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-6 md:py-8 rounded-[32px] md:rounded-[40px] font-black text-xl md:text-3xl hover:bg-green-500 transition-all shadow-3xl shadow-green-500/30 flex flex-col items-center justify-center group active:scale-95 border-b-8 border-green-800 dark:border-green-700"
                >
                    اطلب الآن - الدفع عند الاستلام
                    <span className="text-[10px] md:text-xs opacity-70 mt-1 font-black uppercase tracking-widest flex items-center gap-2">
                        <Truck size={14} className="animate-bounce" /> توصيل منزلي مجاني لجميع المدن 🚚
                    </span>
                </button>
            </div>

            <div className="pt-8">
                <ShareButtons url={productUrl} title={product.title} image={product.imageUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
