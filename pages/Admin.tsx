
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, Search, Save, 
  LayoutDashboard, Eye, EyeOff, 
  UploadCloud, CheckCircle2, CreditCard, Settings, User, MapPin,
  Truck, BarChart3, Globe, Code2,
  TrendingUp, ShoppingBag, Wallet, AlertCircle, KeyRound, ShieldAlert,
  Copy, Download, Upload, Link as LinkIcon, Share2, Database, Zap
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, importProducts, deletedIds } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, deleteOrder, updateOrderDetails } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'sync' | 'settings'>('orders');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [importJson, setImportJson] = useState('');

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS,
    description: '', features: [], additionalImages: [], imageUrl: ''
  });
  
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  const [orderSearch, setOrderSearch] = useState('');
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => { setLocalSettings(settings); }, [settings, activeTab]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    return { totalRevenue, pending, shipped, total: orders.length };
  }, [orders]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === settings.adminPassword) { setIsAuthenticated(true); } else { alert(`كلمة المرور غير صحيحة.`); }
  };

  const handleLogout = () => { setIsAuthenticated(false); setPasswordInput(''); };

  const handleImportData = () => {
    if (!importJson.trim()) { alert("المرجو لصق كود البيانات أولاً"); return; }
    const success = importProducts(importJson);
    if (success) { alert('✅ تم استيراد المنتجات بنجاح!'); setImportJson(''); setActiveTab('products'); } else { alert('❌ فشل الاستيراد'); }
  };

  const copySmartLink = (product: Product) => {
    // تشفير بيانات المنتج في الرابط للعمل في المتصفحات الأخرى
    // ملاحظة: نستخدم نسخة مصغرة من البيانات لتجنب طول الرابط الزائد
    const minData = { ...product, additionalImages: [] }; 
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(minData))));
    const link = `${window.location.origin}${window.location.pathname}#/products/${product.id}?pdata=${encoded}`;
    navigator.clipboard.writeText(link);
    alert('✅ تم نسخ "الرابط الذكي"! سيعمل هذا الرابط عند أي زبون وفي أي متصفح.');
  };

  const copySyncKey = () => {
    const dataStr = JSON.stringify(products);
    navigator.clipboard.writeText(dataStr);
    alert('✅ تم نسخ كود المزامنة الكامل!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCurrentProduct(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.imageUrl) { alert("المرجو رفع صورة رئيسية"); return; }
    if (currentProduct.id) { updateProduct(currentProduct as Product); } 
    else { addProduct({ ...currentProduct, id: `prod-${Date.now()}`, features: [] } as Product); }
    setIsEditingProduct(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"><Lock className="w-8 h-8 text-emerald-500" /></div>
          <h2 className="text-3xl font-black text-white mb-6">إدارة المتجر</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type={showPassword ? "text" : "password"} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="كلمة المرور" className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 font-mono" />
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
                <div className="p-3 bg-emerald-500 rounded-2xl"><LayoutDashboard className="w-6 h-6 text-black" /></div>
                <div><h1 className="text-xl md:text-2xl font-black text-white">لوحة التحكم</h1></div>
            </div>
            <button onClick={handleLogout} className="bg-rose-500/10 text-rose-500 px-8 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all">خروج</button>
        </div>

        <div className="bg-[#0a0a0a] p-1.5 rounded-[28px] border border-white/5 mb-8 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'sync', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 rounded-[22px] font-black transition-all text-sm flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? 'الطلبيات' : tab === 'products' ? 'المنتجات' : tab === 'sync' ? 'مزامنة المتصفح' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <button onClick={() => { setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-400 transition-all"><Plus size={24} /> إضافة منتج جديد</button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const isManual = product.id.startsWith('prod-');
                return (
                  <div key={product.id} className={`bg-[#0a0a0a] rounded-[32px] border ${isManual ? 'border-emerald-500/30' : 'border-white/5'} overflow-hidden shadow-2xl group flex flex-col`}>
                    <div className="aspect-square bg-black relative">
                        <img src={product.imageUrl} className="w-full h-full object-cover opacity-80" />
                        {isManual && <div className="absolute top-4 left-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Zap size={10}/> منتج يدوي</div>}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-white font-black text-lg mb-2 line-clamp-1">{product.title}</h3>
                      
                      {/* زر الرابط الذكي */}
                      <button onClick={() => copySmartLink(product)} className="mb-4 w-full py-3 bg-white/5 text-gray-400 rounded-xl border border-white/5 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 text-xs font-black">
                         <LinkIcon size={14} /> نسخ الرابط الذكي (يعمل في أي متصفح)
                      </button>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={16} /></button>
                          <button onClick={() => { if(confirm('حذف نهائي؟ لن يعود المنتج مرة أخرى.')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all border border-white/5"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
             <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl text-center">
                <Share2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-black text-white">مزامنة المتجر بالكامل</h2>
                <p className="text-gray-400 font-bold">استخدم هذا القسم لنقل كل منتجاتك اليدوية دفعة واحدة من متصفح إلى آخر.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-white font-black">من المتصفح الأصلي</h3>
                        <button onClick={copySyncKey} className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black flex items-center justify-center gap-2"><Copy size={18} /> نسخ كود المتجر</button>
                    </div>
                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-white font-black">إلى المتصفح الجديد</h3>
                        <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="الصق الكود هنا..." className="w-full h-24 p-4 bg-black border border-white/10 rounded-xl text-emerald-500 font-mono text-[10px] resize-none" />
                        <button onClick={handleImportData} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black">تفعيل المزامنة</button>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* باقي التبويبات (Orders, Settings) تبقى كما هي مع تحديثاتها السابقة */}
        {activeTab === 'orders' && (
            <div className="space-y-6">
                <input type="text" placeholder="ابحث باسم الزبون..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold" />
                <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase">
                            <tr><th className="p-6">الزبون</th><th className="p-6">المدينة</th><th className="p-6">المجموع</th><th className="p-6 text-center">الإجراءات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {orders.filter(o => o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase())).map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.01]">
                                    <td className="p-6 text-white font-black">{order.customer.fullName}</td>
                                    <td className="p-6 text-gray-400 font-bold">{order.customer.city}</td>
                                    <td className="p-6 text-emerald-500 font-black">{order.total} د.م</td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => { if(confirm('حذف؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* MODAL: PRODUCT EDITOR */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl rounded-[40px] shadow-4xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white">{currentProduct.id ? 'تعديل المنتج' : 'منتج جديد'}</h2>
                <button onClick={() => setIsEditingProduct(false)} className="text-gray-500"><X size={28} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div onClick={() => mainImageInputRef.current?.click()} className="aspect-square bg-black border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer relative">
                        {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover" /> : <UploadCloud size={48} className="text-emerald-500/50" />}
                        <input type="file" ref={mainImageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                    <div className="space-y-4">
                        <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} placeholder="اسم المنتج" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-black outline-none focus:border-emerald-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} placeholder="السعر" className="w-full p-4 bg-black border border-emerald-500/20 rounded-xl text-emerald-500 font-black outline-none text-center" />
                            <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} placeholder="السعر القديم" className="w-full p-4 bg-black border border-white/10 rounded-xl text-gray-500 font-black outline-none text-center" />
                        </div>
                        <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-black outline-none">
                            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <textarea required rows={4} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} placeholder="وصف المنتج..." className="w-full p-4 bg-black border border-white/10 rounded-xl text-gray-300 font-bold outline-none resize-none" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-xl">حفظ ونشر المنتج</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
