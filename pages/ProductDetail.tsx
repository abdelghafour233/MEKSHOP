
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ShieldCheck, CheckCircle, AlertTriangle, Home, DownloadCloud } from 'lucide-react';
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

  // البحث عن بيانات المنتج في الرابط (Magic Link) إذا لم يكن موجوداً محلياً
  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.imageUrl);
    } else {
      // محاولة استخراج البيانات من Query Params (للمتصفحات الأخرى)
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
      if (!activeImage) setActiveImage(product.imageUrl);
    }
  }, [product, activeImage]);

  if (isImporting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-black">جاري مزامنة بيانات المنتج...</p>
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
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">عذراً، المنتج غير متوفر</h2>
            <p className="text-slate-500 dark:text-gray-500 font-bold leading-relaxed">
                يبدو أن هذا المنتج مضاف يدوياً في متصفح آخر. لمزامنة المتجر بالكامل، يرجى استخدام "كود المزامنة" من لوحة التحكم.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
              <Link to="/products" className="bg-green-600 dark:bg-green-500 text-white dark:text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> تصفح الكتالوج
              </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleOrderNow = () => { addToCart(product); navigate('/checkout'); };
  const gallery = [product.imageUrl, ...(product.additionalImages || [])];
  const currentUrl = window.location.href;

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-green-500 mb-8 font-black transition-colors group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> العودة
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          <div className="space-y-6 md:space-y-8">
            <div className="aspect-square md:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <img src={activeImage || product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {gallery.map((img, idx) => (
                        <button key={idx} onClick={() => setActiveImage(img)} className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-green-600' : 'border-white/5 opacity-50'}`}>
                            <img src={img} alt={`${product.title} gallery ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>
          <div className="flex flex-col h-full">
            <div className="inline-block bg-green-500/10 text-green-600 dark:text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit border border-green-500/20">{product.category}</div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-6 mb-8 bg-white dark:bg-[#0a0a0a] p-6 rounded-[32px] border border-slate-200 dark:border-white/5 w-fit shadow-xl">
              <span className="text-4xl font-black text-green-600 dark:text-green-500">{product.price} د.م</span>
              {product.oldPrice && <span className="text-xl text-slate-400 line-through font-bold">{product.oldPrice} د.م</span>}
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm mb-10">
              <h2 className="font-black text-slate-900 dark:text-white mb-6 text-xl flex items-center gap-3"><div className="w-1.5 h-6 bg-green-600 rounded-full"></div> الوصف الكامل</h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg font-medium whitespace-pre-line">{product.description}</p>
            </div>
            <button onClick={handleOrderNow} className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-7 rounded-[32px] font-black text-2xl hover:bg-green-500 transition-all shadow-2xl shadow-green-500/30 flex flex-col items-center justify-center group active:scale-95 border-b-4 border-green-800 dark:border-green-700">
                اطلب الآن - الدفع عند الاستلام
                <span className="text-[10px] opacity-70 mt-1 font-bold uppercase tracking-widest">توصيل منزلي مجاني وسريع 🚚</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
