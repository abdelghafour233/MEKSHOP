
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, Search, Save, 
  LayoutDashboard, Smartphone, QrCode, Copy, Eye, EyeOff, 
  UploadCloud, CheckCircle2, CreditCard, Settings, User, MapPin, Phone,
  Clock, CheckCircle, Truck, BarChart3, Globe, Code2,
  TrendingUp, ShoppingBag, Wallet, AlertCircle
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, deleteOrder, updateOrderDetails } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  // States for Product Modal
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS,
    description: '', features: [], additionalImages: [], imageUrl: ''
  });
  
  // States for Order Modal
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  const [orderSearch, setOrderSearch] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, activeTab]);

  // Stats Calculation
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    return { totalRevenue, pending, shipped, total: orders.length };
  }, [orders]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === settings.adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert(`كلمة المرور غير صحيحة.`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isMain) {
          setCurrentProduct(prev => ({ ...prev, imageUrl: base64String }));
        } else {
          const currentGallery = currentProduct.additionalImages || [];
          if (currentGallery.length >= 6) {
            alert("أقصى عدد للصور هو 6");
            return;
          }
          setCurrentProduct(prev => ({ 
            ...prev, 
            additionalImages: [...(prev.additionalImages || []), base64String] 
          }));
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      additionalImages: (prev.additionalImages || []).filter((_, i) => i !== index)
    }));
  };

  const syncDataString = useMemo(() => {
    const minimalProducts = products.slice(0, 15).map(p => ({
        id: p.id, t: p.title, p: p.price, c: p.category
    }));
    const data = { p: minimalProducts, s: localSettings };
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch(e) {
        return "error_data_too_large";
    }
  }, [products, localSettings]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(syncDataString)}&bgcolor=ffffff&color=000000&margin=15`;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.imageUrl) {
      alert("المرجو رفع صورة رئيسية للمنتج أولاً");
      return;
    }

    if (currentProduct.id) {
      updateProduct(currentProduct as Product);
      alert("✅ تم تحديث المنتج بنجاح");
    } else {
      addProduct({
        ...currentProduct,
        id: `prod-${Date.now()}`,
        features: currentProduct.features || []
      } as Product);
      alert("✅ تم إضافة المنتج الجديد بنجاح");
    }
    setIsEditingProduct(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-6">إدارة المتجر</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input type={showPassword ? "text" : "password"} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="كلمة المرور" className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 font-mono" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-emerald-500/20">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-10 pb-24 text-right" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <LayoutDashboard className="w-6 h-6 text-black" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white">لوحة التحكم</h1>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        نظام الإدارة متصل
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <button onClick={() => setShowQRModal(true)} className="flex-1 lg:flex-none bg-white/5 text-white px-6 py-4 rounded-2xl border border-white/10 font-black flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all">
                    <QrCode size={18} /> <span className="text-sm">مزامنة الهاتف</span>
                </button>
                <button onClick={handleLogout} className="flex-1 lg:flex-none bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <LogOut size={18} /> <span className="text-sm">خروج</span>
                </button>
            </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
                { label: 'إجمالي الطلبات', value: stats.total, icon: <ShoppingBag />, color: 'blue' },
                { label: 'طلبات معلقة', value: stats.pending, icon: <AlertCircle />, color: 'amber' },
                { label: 'تم الشحن', value: stats.shipped, icon: <Truck />, color: 'emerald' },
                { label: 'إجمالي المبيعات', value: `${stats.totalRevenue} د.م`, icon: <Wallet />, color: 'indigo' }
            ].map((stat, i) => (
                <div key={i} className={`bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden group border-l-4 border-${stat.color}-500`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-xl`}>{stat.icon}</div>
                        <TrendingUp size={16} className="text-gray-700" />
                    </div>
                    <p className="text-gray-500 text-[11px] font-black uppercase mb-1">{stat.label}</p>
                    <h3 className="text-white text-xl md:text-2xl font-black">{stat.value}</h3>
                </div>
            ))}
        </div>

        {/* Tabs */}
        <div className="bg-[#0a0a0a] p-1.5 rounded-[28px] border border-white/5 mb-8 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 rounded-[22px] font-black transition-all text-sm flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? <CreditCard size={18}/> : tab === 'products' ? <Package size={18}/> : <Settings size={18}/>}
                {tab === 'orders' ? 'إدارة الطلبيات' : tab === 'products' ? 'الكتالوج' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input type="text" placeholder="ابحث باسم الزبون، رقم الهاتف، أو المدينة..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-14 pl-6 py-5 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold transition-all shadow-xl" />
                </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[1000px]">
                  <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="p-6">الزبون</th>
                      <th className="p-6">المدينة</th>
                      <th className="p-6">المجموع</th>
                      <th className="p-6 text-center">حالة الطلب</th>
                      <th className="p-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {orders.filter(o => 
                        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                        o.customer.phone.includes(orderSearch) ||
                        o.customer.city.includes(orderSearch)
                    ).map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-lg border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                {order.customer.fullName.charAt(0)}
                            </div>
                            <div>
                                <div className="font-black text-white text-base">{order.customer.fullName}</div>
                                <div className="text-gray-600 text-[11px] font-mono mt-0.5">{order.customer.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                                <MapPin size={14} className="text-gray-600" />
                                {order.customer.city}
                            </div>
                        </td>
                        <td className="p-6">
                          <div className="text-emerald-500 font-black text-lg">{order.total} د.م</div>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setCurrentOrder(order); setIsEditingOrder(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={16} /></button>
                            <button onClick={() => { if(confirm('حذف الطلب؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all border border-white/5"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <button 
              onClick={() => { 
                setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); 
                setIsEditingProduct(true); 
              }} 
              className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-400 transition-all active:scale-95 group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform" /> إضافة منتج جديد للكتالوج
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl group flex flex-col hover:border-emerald-500 transition-all duration-500">
                  <div className="aspect-square bg-black relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-700" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-black text-lg mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 transition-all border border-white/5"><Edit size={16} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all border border-white/5"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-6xl mx-auto space-y-10 pb-24">
            <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-emerald-500/20 shadow-4xl text-center">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center justify-center gap-4"><Smartphone className="text-emerald-500" size={28}/> الربط السريع بالهاتف</h2>
              <div className="bg-white p-6 rounded-[32px] inline-block mb-10 shadow-3xl">
                  <img src={qrImageUrl} className="w-[280px] h-[280px]" alt="Sync QR" />
              </div>
              <div className="flex justify-center">
                  <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ كود المزامنة!'); }} className="px-10 py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={18}/> نسخ الكود يدوياً
                  </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateSettings(localSettings); alert("✅ تم حفظ الإعدادات!"); }} className="space-y-8">
              <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
                <h2 className="text-xl font-black text-white border-r-4 border-blue-500 pr-5 flex items-center gap-3">
                    <BarChart3 className="text-blue-500" size={20}/> إعدادات التتبع والبيكسل
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2"><Globe size={12}/> Facebook Pixel ID</label>
                    <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono outline-none focus:border-blue-500 shadow-inner" placeholder="ID" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2 flex items-center gap-2"><Code2 size={12}/> FB Test Event Code</label>
                    <input type="text" value={localSettings.fbTestEventCode || ''} onChange={(e) => setLocalSettings({...localSettings, fbTestEventCode: e.target.value})} className="w-full p-4 bg-black border border-emerald-500/20 rounded-xl text-emerald-500 font-mono outline-none focus:border-emerald-500 shadow-inner" placeholder="TESTXXXX" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2"><Globe size={12}/> Google Tag ID</label>
                    <input type="text" value={localSettings.googleTagId || ''} onChange={(e) => setLocalSettings({...localSettings, googleTagId: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono outline-none focus:border-amber-500 shadow-inner" placeholder="G-XXXX" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2"><Globe size={12}/> TikTok Pixel ID</label>
                    <input type="text" value={localSettings.tiktokPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, tiktokPixelId: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono outline-none focus:border-rose-500 shadow-inner" placeholder="CXXXXXXXX" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
                <h2 className="text-xl font-black text-white border-r-4 border-emerald-500 pr-5">البيانات والأمان</h2>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Google Sheets Webhook URL</label>
                    <input type="text" value={localSettings.googleSheetUrl || ''} onChange={(e) => setLocalSettings({...localSettings, googleSheetUrl: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono outline-none focus:border-emerald-500 shadow-inner" placeholder="https://script.google.com/..." />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-[28px] font-black text-xl shadow-3xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Save size={24} /> حفظ كافة التغييرات
              </button>
            </form>
          </div>
        )}

        {/* MODAL: PRODUCT EDITOR (FIXED) */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-center justify-center p-4">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-5xl rounded-[40px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[92vh]">
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Package size={24}/></div>
                  <h2 className="text-xl font-black text-white">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                </div>
                <button onClick={() => setIsEditingProduct(false)} className="p-2 text-gray-500 hover:text-white transition-all"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <form id="fixedProductForm" onSubmit={handleSaveProduct} className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">الصورة الرئيسية (مطلوبة)</label>
                        <div onClick={() => mainImageInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-black">
                          {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover" /> : <UploadCloud size={48} className="text-emerald-500 opacity-40" />}
                          <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">المعرض (حتى 6 صور)</label>
                        <div className="grid grid-cols-3 gap-3">
                          {(currentProduct.additionalImages || []).map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-white/5">
                              <img src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"><Trash2 size={16}/></button>
                            </div>
                          ))}
                          {(currentProduct.additionalImages || []).length < 6 && (
                            <button type="button" onClick={() => galleryImageInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:text-emerald-500 transition-all"><Plus size={24} /></button>
                          )}
                        </div>
                        <input type="file" ref={galleryImageInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" accept="image/*" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">اسم المنتج</label>
                        <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-black outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2">السعر الحالي</label>
                          <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-4 bg-black border border-emerald-500/20 rounded-xl text-emerald-500 font-black outline-none focus:border-emerald-500 text-center" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">السعر القديم</label>
                          <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-gray-500 font-black outline-none focus:border-emerald-500 text-center" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">التصنيف</label>
                        <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-black outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">الوصف الكامل</label>
                        <textarea required rows={6} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-gray-300 font-bold outline-none focus:border-emerald-500 resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex gap-4">
                    <button type="submit" className="flex-1 bg-emerald-500 text-black py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                      <CheckCircle2 size={24} /> {currentProduct.id ? 'حفظ التعديلات' : 'نشر المنتج الآن'}
                    </button>
                    <button type="button" onClick={() => setIsEditingProduct(false)} className="px-10 bg-white/5 text-gray-400 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ORDER EDITOR */}
        {isEditingOrder && currentOrder && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-center justify-center p-4">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-3xl rounded-[40px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CreditCard size={24}/></div>
                        <h2 className="text-xl font-black text-white">تفاصيل الطلبية #{currentOrder.id.split('-')[1]}</h2>
                    </div>
                    <button onClick={() => setIsEditingOrder(false)} className="p-2 text-gray-500 hover:text-white transition-all"><X size={28} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">اسم الزبون</label>
                            <input type="text" value={currentOrder.customer.fullName} onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, fullName: e.target.value}})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-bold outline-none focus:border-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">رقم الهاتف</label>
                            <input type="text" value={currentOrder.customer.phone} onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, phone: e.target.value}})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono text-left outline-none focus:border-emerald-500" dir="ltr" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">المدينة</label>
                            <input type="text" value={currentOrder.customer.city} onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, city: e.target.value}})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-bold outline-none focus:border-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">حالة الطلبية</label>
                            <select value={currentOrder.status} onChange={(e) => setCurrentOrder({...currentOrder, status: e.target.value as OrderStatus})} className="w-full p-4 bg-black border border-emerald-500/30 rounded-xl text-white font-black outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                                <option value="Pending">قيد الانتظار</option>
                                <option value="Confirmed">تم التأكيد</option>
                                <option value="Shipped">تم الشحن</option>
                                <option value="Cancelled">ملغى</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-black/60 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-white/5 border-b border-white/5 font-black text-gray-400 text-xs uppercase tracking-widest">المنتجات المطلوبة</div>
                        <div className="p-6 space-y-4">
                            {currentOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-white/[0.03] pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="text-white font-bold text-xs">{item.title} (x{item.quantity})</div>
                                    </div>
                                    <div className="text-emerald-500 font-black text-xs">{item.price * item.quantity} د.م</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-white/5 flex gap-4">
                    <button onClick={() => { updateOrderDetails(currentOrder); setIsEditingOrder(false); alert('✅ تم تحديث بيانات الطلب!'); }} className="flex-1 bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">تحديث الطلب</button>
                    <button onClick={() => setIsEditingOrder(false)} className="px-8 bg-white/5 text-gray-400 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
                </div>
            </div>
          </div>
        )}

        {/* QR Sync Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[3000] flex items-center justify-center p-4">
             <div className="bg-[#111] p-12 rounded-[48px] border border-white/10 max-w-xl w-full text-center relative shadow-4xl animate-in zoom-in duration-300">
                <button onClick={() => setShowQRModal(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={28}/></button>
                <div className="bg-white p-6 rounded-[32px] mb-10 inline-block shadow-3xl">
                    <img src={qrImageUrl} className="w-[300px] h-[300px]" alt="Sync QR" />
                </div>
                <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم النسخ!'); }} className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={20}/> نسخ كود البيانات للمزامنة
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status: OrderStatus) => {
  switch(status) {
    case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Shipped': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default: return 'bg-gray-500/10 text-gray-500';
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch(status) {
    case 'Pending': return 'بانتظار التأكيد';
    case 'Confirmed': return 'تم التأكيد ✅';
    case 'Shipped': return 'تم الشحن 🚚';
    case 'Cancelled': return 'ملغى ❌';
    default: return status;
  }
};

export default Admin;
