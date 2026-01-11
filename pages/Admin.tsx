
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, LayoutDashboard, 
  UploadCloud, CreditCard, Settings, Link as LinkIcon, Share2, Zap, AlertCircle
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, clearAllProducts, importProducts } = useProducts();
  const { settings } = useSettings();
  const { orders, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'sync' | 'settings'>('orders');
  
  const [importJson, setImportJson] = useState('');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS,
    description: '', features: [], additionalImages: [], imageUrl: ''
  });
  
  const [orderSearch, setOrderSearch] = useState('');

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === settings.adminPassword) { setIsAuthenticated(true); } 
    else { alert(`كلمة المرور غير صحيحة.`); }
  };

  const handleLogout = () => { setIsAuthenticated(false); setPasswordInput(''); };

  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`⚠️ حذف نهائي للمنتج: "${title}"؟`)) {
      deleteProduct(id);
    }
  };

  const copySmartLink = (product: Product) => {
    try {
      const minData = { 
        id: product.id, title: product.title, price: product.price, 
        oldPrice: product.oldPrice, category: product.category,
        description: product.description, imageUrl: product.imageUrl, features: product.features
      }; 
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(minData))));
      const link = `${window.location.origin}${window.location.pathname}#/products/${product.id}?pdata=${encoded}`;
      navigator.clipboard.writeText(link);
      alert('✅ تم نسخ "الرابط الذكي"!');
    } catch (e) { alert('❌ فشل إنشاء الرابط'); }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.imageUrl) { alert("المرجو رفع صورة رئيسية"); return; }
    if (currentProduct.id) { updateProduct(currentProduct as Product); } 
    else { addProduct({ ...currentProduct, id: `prod-${Date.now()}`, features: [] } as Product); }
    setIsEditingProduct(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setCurrentProduct(prev => ({ ...prev, imageUrl: reader.result as string })); };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"><Lock className="w-8 h-8 text-emerald-500" /></div>
          <h2 className="text-3xl font-black text-white mb-6">إدارة المتجر</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="كلمة المرور" className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 font-mono" />
            <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-emerald-500/20">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-10 pb-24 text-right" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <LayoutDashboard className="w-6 h-6 text-black" />
                </div>
                <div><h1 className="text-xl md:text-2xl font-black text-white">لوحة التحكم</h1></div>
            </div>
            <div className="flex gap-4">
                <button onClick={clearAllProducts} className="bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl border border-rose-500/20 font-black flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={18}/> مسح كل المنتجات
                </button>
                <button onClick={handleLogout} className="bg-white/5 text-gray-400 px-8 py-4 rounded-2xl border border-white/10 font-black hover:bg-white/10 hover:text-white transition-all">خروج</button>
            </div>
        </div>

        <div className="bg-[#0a0a0a] p-1.5 rounded-[28px] border border-white/5 mb-8 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'sync', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 rounded-[22px] font-black transition-all text-sm flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? <CreditCard size={18}/> : tab === 'products' ? <Package size={18}/> : tab === 'sync' ? <Share2 size={18}/> : <Settings size={18}/>}
                {tab === 'orders' ? 'الطلبيات' : tab === 'products' ? 'المنتجات' : tab === 'sync' ? 'المزامنة' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <button onClick={() => { setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-400 transition-all"><Plus size={24} /> إضافة منتج جديد</button>
            
            {products.length === 0 ? (
                <div className="bg-[#0a0a0a] p-20 rounded-[40px] border border-white/5 text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-gray-700 mx-auto" />
                    <p className="text-gray-500 font-black text-xl">لا توجد منتجات حالياً. أضف منتجك الأول!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => {
                    const isManual = product.id.startsWith('prod-');
                    return (
                    <div key={product.id} className={`bg-[#0a0a0a] rounded-[32px] border ${isManual ? 'border-emerald-500/40' : 'border-white/5'} overflow-hidden shadow-2xl group flex flex-col hover:scale-[1.02] transition-all`}>
                        <div className="aspect-square bg-black relative overflow-hidden">
                            <img src={product.imageUrl} className="w-full h-full object-cover opacity-80" alt={product.title} />
                            {isManual && <div className="absolute top-4 left-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Zap size={10}/> مضاف</div>}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-white font-black text-lg mb-4 line-clamp-1">{product.title}</h3>
                        <button onClick={() => copySmartLink(product)} className="mb-4 w-full py-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 text-[11px] font-black">
                            <LinkIcon size={14} /> نسخ الرابط الذكي
                        </button>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                            <div className="flex gap-2">
                            <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteProduct(product.id, product.title)} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <input type="text" placeholder="ابحث باسم الزبون أو الهاتف..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold" />
            <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[800px]">
                  <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase border-b border-white/5">
                    <tr><th className="p-6">الزبون</th><th className="p-6">المدينة</th><th className="p-6">المجموع</th><th className="p-6 text-center">الإجراءات</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {orders.filter(o => o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || o.customer.phone.includes(orderSearch)).map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.01]">
                        <td className="p-6 text-white font-black">{order.customer.fullName}</td>
                        <td className="p-6 text-gray-400 font-bold">{order.customer.city}</td>
                        <td className="p-6 text-emerald-500 font-black">{order.total} د.م</td>
                        <td className="p-6 text-center"><button onClick={() => { if(confirm('حذف؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl rounded-[40px] shadow-4xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-black text-white">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={() => setIsEditingProduct(false)} className="text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div onClick={() => mainImageInputRef.current?.click()} className="aspect-square bg-black border-2 border-dashed border-white/10 rounded-[32px] flex items-center justify-center overflow-hidden cursor-pointer relative group">
                            {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <UploadCloud size={48} className="text-emerald-500/50" />}
                            <input type="file" ref={mainImageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">اسم المنتج</label>
                           <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} placeholder="اسم المنتج" className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-black outline-none focus:border-emerald-500 shadow-inner" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2">السعر</label>
                               <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} placeholder="0.00" className="w-full p-4 bg-black border border-emerald-500/20 rounded-2xl text-emerald-500 font-black outline-none text-center shadow-inner" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">السعر القديم</label>
                               <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} placeholder="0.00" className="w-full p-4 bg-black border border-white/10 rounded-2xl text-gray-500 font-black outline-none text-center shadow-inner" />
                            </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">التصنيف</label>
                           <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-black outline-none appearance-none cursor-pointer">
                               {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">الوصف</label>
                           <textarea required rows={4} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} placeholder="وصف المنتج..." className="w-full p-4 bg-black border border-white/10 rounded-2xl text-gray-300 font-bold outline-none resize-none shadow-inner" />
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-[28px] font-black text-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">حفظ ونشر المنتج</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
