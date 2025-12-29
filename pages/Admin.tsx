
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
// Added Settings icon to the lucide-react imports
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, Search, Save, 
  LayoutDashboard, Smartphone, QrCode, KeyRound, Megaphone, 
  ImagePlus, UploadCloud, Copy, Download, Eye, EyeOff, Info, 
  Images, Tag, DollarSign, AlignRight, CheckCircle2, FileText, 
  Layers, ChevronLeft, CreditCard, Settings
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    oldPrice: 0,
    category: Category.ELECTRONICS,
    description: '',
    features: [],
    additionalImages: [],
    imageUrl: ''
  });
  
  const [orderSearch, setOrderSearch] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, activeTab]);

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

  // تحسين المزامنة: نرسل فقط البيانات الأساسية جداً لضمان عمل الباركود على الحاسوب
  const syncDataString = useMemo(() => {
    const minimalProducts = products.slice(0, 15).map(p => ({
        id: p.id,
        t: p.title,
        p: p.price,
        c: p.category
        // قمنا بحذف الصور هنا لضمان صغر حجم الكود ليعمل على الحاسوب
    }));
    const data = { p: minimalProducts, s: localSettings };
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch(e) {
        return "error_data_too_large";
    }
  }, [products, localSettings]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(syncDataString)}&bgcolor=ffffff&color=000000&margin=15`;

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
    <div className="min-h-screen bg-[#050505] py-6 md:py-12 pb-24">
      <div className="max-w-[1300px] mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-5 relative z-10">
                <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/20">
                    <LayoutDashboard className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">لوحة الإدارة</h1>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-70">berrima store professional</p>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
                <button onClick={() => setShowQRModal(true)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-500 px-6 py-4 rounded-2xl border border-emerald-500/20 font-black flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-black transition-all">
                    <QrCode size={20} /> <span className="hidden sm:inline">مزامنة الهاتف</span>
                </button>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <LogOut size={20} /> <span className="hidden sm:inline">خروج</span>
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-[32px] border border-white/5 mb-10 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black transition-all text-sm flex items-center justify-center gap-3 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {/* Fix: Replaced non-existent SettingsIcon with Settings from lucide-react */}
                {tab === 'orders' ? <CreditCard size={18}/> : tab === 'products' ? <Package size={18}/> : <Settings size={18}/>}
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Tab Content: Products List */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <button onClick={() => { setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-400 transition-all active:scale-95 group">
              <Plus size={24} className="group-hover:rotate-90 transition-transform" /> إضافة منتج جديد
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl group flex flex-col border-b-4 border-b-transparent hover:border-b-emerald-500 transition-all duration-500">
                  <div className="aspect-square bg-black relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-700" />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black shadow-lg uppercase">{product.category}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-black text-lg mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                        {product.oldPrice && <span className="text-gray-600 text-[10px] line-through font-bold">{product.oldPrice} د.م</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={16} /></button>
                        <button onClick={() => { if(confirm('حذف هذا المنتج نهائياً؟')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all hover:text-white border border-white/5"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: PROFESSIONAL PRODUCT EDITOR (The Requested Form) */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[1000] flex items-center justify-center p-2 md:p-8 overflow-hidden">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-7xl rounded-[48px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[92vh] relative overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-10 py-7 bg-black/50 border-b border-white/5">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Package size={32}/></div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Product Management System</p>
                  </div>
                </div>
                <button onClick={() => setIsEditingProduct(false)} className="p-4 bg-white/5 rounded-full text-gray-500 hover:text-white transition-all hover:rotate-90"><X size={32} /></button>
              </div>

              {/* Modal Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                <form id="productForm" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(!currentProduct.imageUrl) { alert("المرجو رفع صورة رئيسية للمنتج"); return; }
                  if(currentProduct.id) updateProduct(currentProduct as Product); 
                  else addProduct({...currentProduct, id: Date.now().toString()} as Product); 
                  setIsEditingProduct(false); 
                }} className="space-y-12">
                  
                  {/* GRID: MEDIA ON ONE SIDE, INFO ON OTHER */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* MEDIA SECTION (Left Side - 5 Columns) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Main Image Block */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Images className="text-emerald-500" size={20} />
                                <h3 className="text-lg font-black text-white">صورة المنتج الرئيسية</h3>
                            </div>
                            <div 
                              onClick={() => mainImageInputRef.current?.click()}
                              className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                                ${currentProduct.imageUrl ? 'border-emerald-500/40 bg-black' : 'border-white/10 hover:border-emerald-500/40 bg-black/40'}`}
                            >
                              {currentProduct.imageUrl ? (
                                <>
                                  <img src={currentProduct.imageUrl} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                    <UploadCloud size={40} className="text-emerald-500 mb-2" />
                                    <span className="text-white font-black text-sm">تغيير الصورة</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center p-8">
                                  <UploadCloud size={64} className="text-emerald-500 mx-auto mb-4 opacity-40" />
                                  <p className="text-sm text-gray-400 font-black">اضغط لرفع الصورة الأساسية</p>
                                  <p className="text-[10px] text-gray-600 mt-2">مقاس 1:1 هو الأفضل</p>
                                </div>
                              )}
                              <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        {/* Gallery Block */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] shadow-xl">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <ImagePlus className="text-emerald-500" size={20} />
                                    <h3 className="text-lg font-black text-white">معرض الصور</h3>
                                </div>
                                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black">{(currentProduct.additionalImages || []).length} / 6</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              {(currentProduct.additionalImages || []).map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/5 bg-black">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 size={24}/></button>
                                </div>
                              ))}
                              {(currentProduct.additionalImages || []).length < 6 && (
                                <button 
                                  type="button" 
                                  onClick={() => galleryImageInputRef.current?.click()} 
                                  className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:text-emerald-500 hover:border-emerald-500/40 transition-all bg-black/50 group"
                                >
                                  <Plus size={32} className="group-hover:scale-110 transition-transform" />
                                </button>
                              )}
                            </div>
                            <input type="file" ref={galleryImageInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* INFO SECTION (Right Side - 7 Columns) */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* 1. Basic Data Card */}
                        <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                           <div className="flex items-center gap-4 mb-10">
                                <Tag className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-black text-white">بيانات المنتج الأساسية</h3>
                           </div>
                           
                           <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mr-2">اسم المنتج بالكامل</label>
                                    <div className="relative group">
                                        <AlignRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-emerald-500 transition-colors" size={24} />
                                        <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-6 pr-16 bg-black border border-white/10 rounded-[28px] text-white font-black text-2xl outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="مثال: ساعة يد أبل ألترا" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mr-2">التصنيف</label>
                                    <div className="relative">
                                        <Layers className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700" size={24} />
                                        <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-6 pr-16 bg-black border border-white/10 rounded-[28px] text-white font-black text-lg outline-none focus:border-emerald-500 appearance-none shadow-inner cursor-pointer">
                                            {Object.values(Category).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                           </div>
                        </div>

                        {/* 2. Pricing Card */}
                        <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] shadow-2xl">
                           <div className="flex items-center gap-4 mb-10">
                                <DollarSign className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-black text-white">إعدادات السعر</h3>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mr-2">السعر الحالي (د.م)</label>
                                    <div className="relative">
                                        <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-7 bg-black border border-emerald-500/30 rounded-[32px] text-emerald-500 font-black text-4xl outline-none focus:border-emerald-500 shadow-xl text-center" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] mr-2">السعر القديم (د.م)</label>
                                    <div className="relative">
                                        <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-7 bg-black border border-white/10 rounded-[32px] text-gray-600 font-black text-4xl outline-none focus:border-emerald-500 shadow-xl text-center" />
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: FULL WIDTH DESCRIPTION */}
                  <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] shadow-2xl space-y-8">
                      <div className="flex items-center gap-4">
                          <FileText className="text-emerald-500" size={28} />
                          <h3 className="text-2xl font-black text-white">وصف المنتج وتفاصيله</h3>
                      </div>
                      <div className="border-2 border-white/5 rounded-[40px] bg-black overflow-hidden focus-within:border-emerald-500 transition-all shadow-inner">
                          <textarea 
                              required
                              rows={12}
                              value={currentProduct.description || ''} 
                              onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} 
                              className="w-full p-10 bg-transparent text-gray-300 text-xl leading-relaxed outline-none resize-none overflow-y-auto scrollbar-hide" 
                              placeholder="أدخل وصفاً مقنعاً للمنتج ومميزاته بالتفصيل..."
                          ></textarea>
                      </div>
                  </div>

                </form>
              </div>

              {/* Action Bar (Fixed at bottom) */}
              <div className="px-10 py-8 bg-black/90 backdrop-blur-2xl border-t border-white/10 flex gap-4">
                  <button type="submit" form="productForm" className="flex-1 bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-3xl shadow-emerald-500/40 active:scale-95 transition-all flex items-center justify-center gap-4">
                    <CheckCircle2 size={32} /> {currentProduct.id ? 'حفظ التغييرات' : 'نشر المنتج في المتجر'}
                  </button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="px-14 bg-white/5 text-gray-400 rounded-[32px] font-black hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative group">
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={24} />
              <input type="text" placeholder="ابحث باسم الزبون أو رقم الهاتف..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-16 pl-8 py-6 bg-[#0a0a0a] border border-white/5 rounded-[32px] text-white outline-none focus:border-emerald-500 font-bold transition-all shadow-xl text-lg" />
            </div>
            <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[900px]">
                  <thead className="bg-black/60 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="p-8">الزبون والمعلومات</th>
                      <th className="p-8">المدينة</th>
                      <th className="p-8">المنتجات</th>
                      <th className="p-8">المبلغ الإجمالي</th>
                      <th className="p-8">الحالة</th>
                      <th className="p-8 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.filter(o => o.customer.fullName.includes(orderSearch) || o.customer.phone.includes(orderSearch)).map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="p-8">
                          <div className="font-black text-white text-lg">{order.customer.fullName}</div>
                          <div className="text-emerald-500 text-sm font-mono mt-1">{order.customer.phone}</div>
                        </td>
                        <td className="p-8 text-gray-400 font-black">{order.customer.city}</td>
                        <td className="p-8 text-gray-500 text-sm">
                            {order.items.map(item => `${item.title} (${item.quantity})`).join(', ')}
                        </td>
                        <td className="p-8 text-white font-black text-xl">{order.total} د.م</td>
                        <td className="p-8">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-8 text-center">
                          <button onClick={() => { if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) deleteOrder(order.id) }} className="p-4 bg-white/5 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-white/5"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
            {/* باركود المزامنة - نسخة مطورة تعمل على الحاسوب */}
            <div className="bg-[#0a0a0a] p-10 md:p-16 rounded-[56px] border border-emerald-500/20 shadow-4xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500/20"></div>
              <h2 className="text-3xl font-black text-white mb-8 flex items-center justify-center gap-5"><Smartphone className="text-emerald-500" size={32}/> مزامنة بيانات الهاتف</h2>
              <p className="text-gray-500 mb-10 font-bold max-w-xl mx-auto leading-relaxed">قم بمسح الباركود التالي من كاميرا هاتفك لنقل المنتجات والإعدادات الحالية إليه مباشرة وبسرعة فائقة.</p>
              
              <div className="bg-white p-8 rounded-[48px] inline-block mb-10 shadow-3xl border-8 border-emerald-500/10 group-hover:scale-105 transition-transform duration-500">
                  <img src={qrImageUrl} className="w-[320px] h-[320px]" alt="Sync QR Code" crossOrigin="anonymous" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ كود المزامنة بنجاح!'); }} className="w-full sm:w-auto px-12 py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={20}/> نسخ كود البيانات
                  </button>
                  <button onClick={() => window.print()} className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all">
                      <Download size={20}/> حفظ كصورة
                  </button>
              </div>
            </div>

            {/* باقي الإعدادات */}
            <form onSubmit={(e) => { e.preventDefault(); updateSettings(localSettings); alert("✅ تم حفظ الإعدادات!"); }} className="space-y-10">
              <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white flex items-center gap-4 border-r-4 border-blue-500 pr-6">التتبع والإعلانات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">Facebook Pixel ID</label>
                    <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-blue-500 transition-all" placeholder="أدخل معرف بيكسل فيسبوك" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">Google AdSense ID</label>
                    <input type="text" value={localSettings.googleAdsenseId || ''} onChange={(e) => setLocalSettings({...localSettings, googleAdsenseId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-amber-500 transition-all" placeholder="ca-pub-..." />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-3xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-4">
                <Save size={32} /> حفظ كافة التغييرات
              </button>
            </form>
          </div>
        )}

        {/* Sync QR Modal (For Quick Access) */}
        {showQRModal && activeTab !== 'settings' && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-center justify-center p-4">
             <div className="bg-[#111] p-12 rounded-[56px] border border-white/10 max-w-xl w-full text-center relative shadow-4xl animate-in fade-in zoom-in duration-500">
                <button onClick={() => setShowQRModal(false)} className="absolute top-10 left-10 text-gray-500 hover:text-white transition-colors p-3 bg-white/5 rounded-full"><X size={32}/></button>
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10">
                    <QrCode size={40} className="text-emerald-500"/>
                </div>
                <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">مزامنة البيانات</h2>
                <p className="text-gray-500 font-bold mb-10 leading-relaxed">امسح الكود لفتح لوحة التحكم على هاتفك ومتابعة الطلبات فوراً.</p>
                <div className="bg-white p-8 rounded-[48px] mb-12 inline-block shadow-[0_0_80px_rgba(16,185,129,0.15)] border-4 border-white">
                    <img src={qrImageUrl} className="w-[300px] h-[300px]" alt="Sync QR Large" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم النسخ!'); }} className="py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={22}/> نسخ
                  </button>
                  <button onClick={() => setShowQRModal(false)} className="py-5 bg-white/5 text-white rounded-2xl font-black flex items-center justify-center gap-3 border border-white/10 active:scale-95 transition-all hover:bg-white/10">
                      إغلاق
                  </button>
                </div>
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
    case 'Pending': return 'قيد الانتظار';
    case 'Confirmed': return 'تم التأكيد';
    case 'Shipped': return 'تم الشحن';
    case 'Cancelled': return 'ملغى';
    default: return status;
  }
};

export default Admin;
