
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, Search, Save, 
  LayoutDashboard, Smartphone, QrCode, KeyRound, Megaphone, 
  ImagePlus, UploadCloud, Copy, Download, Eye, EyeOff, Info, 
  Images, Tag, DollarSign, AlignRight, CheckCircle2, FileText, 
  Layers
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
    setShowPassword(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSettings = { ...localSettings };
    if (passwords.new) {
      if (passwords.new !== passwords.confirm) {
        alert("كلمتا السر غير متطابقتين!");
        return;
      }
      updatedSettings.adminPassword = passwords.new;
    }
    updateSettings(updatedSettings);
    setPasswords({ new: '', confirm: '' });
    alert("✅ تم حفظ التغييرات بنجاح!");
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
            alert("أقصى عدد للصور الإضافية هو 6");
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
    const minimalProducts = products.map(p => ({
        id: p.id,
        t: p.title,
        p: p.price,
        c: p.category,
        img: p.imageUrl
    }));
    const data = { p: minimalProducts, s: localSettings };
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }, [products, localSettings]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(syncDataString)}&bgcolor=ffffff&color=000000&margin=20`;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 w-full max-w-md shadow-3xl text-center relative">
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
            <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg active:scale-95 transition-all">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-10 pb-24">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg">
                    <LayoutDashboard className="w-6 h-6 text-black" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">berrima store administration</p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <button onClick={() => setShowQRModal(true)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-500 px-5 py-3 rounded-xl border border-emerald-500/20 font-black flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all">
                    <QrCode size={18} /> مزامنة الهاتف
                </button>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-5 py-3 rounded-xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut size={18} /> خروج
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0a0a0a] p-1.5 rounded-[24px] border border-white/5 mb-8 flex gap-1 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] py-3.5 rounded-xl font-black transition-all text-xs flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <button onClick={() => { setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
              <Plus size={20} /> إضافة منتج جديد للمتجر
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[28px] border border-white/5 overflow-hidden shadow-xl group flex flex-col">
                  <div className="aspect-square bg-black relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-white font-black text-sm mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-emerald-500 font-black text-base">{product.price} د.م</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-2.5 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={14} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-2.5 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all hover:text-white border border-white/5"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: PROFESSIONAL PRODUCT EDITOR */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[1000] flex items-center justify-center p-2 md:p-6 overflow-hidden">
            <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-7xl rounded-[48px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[92vh] overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-6 bg-black/50 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl"><Package size={28}/></div>
                  <h2 className="text-2xl font-black text-white">{currentProduct.id ? 'تحرير بيانات المنتج' : 'إضافة منتج جديد'}</h2>
                </div>
                <button onClick={() => setIsEditingProduct(false)} className="p-2 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                <form id="productForm" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(!currentProduct.imageUrl) { alert("المرجو رفع صورة رئيسية"); return; }
                  if(currentProduct.id) updateProduct(currentProduct as Product); 
                  else addProduct({...currentProduct, id: Date.now().toString()} as Product); 
                  setIsEditingProduct(false); 
                }} className="space-y-12">
                  
                  {/* MAIN SECTION: INFO & MEDIA GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDE: TEXT DATA (7 Columns) */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* 1. Basic Information Card */}
                        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                           <div className="flex items-center gap-3 mb-8">
                                <Tag className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-black text-white">البيانات العامة</h3>
                           </div>
                           
                           <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">اسم المنتج بالكامل</label>
                                    <div className="relative group">
                                        <AlignRight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500" size={20} />
                                        <input 
                                            required 
                                            value={currentProduct.title || ''} 
                                            onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} 
                                            className="w-full p-6 pr-14 bg-black border border-white/10 rounded-[28px] text-white font-black text-xl outline-none focus:border-emerald-500 transition-all shadow-inner" 
                                            placeholder="أدخل اسم المنتج هنا..." 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">تصنيف المنتج</label>
                                    <div className="relative">
                                        <Layers className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                        <select 
                                            value={currentProduct.category} 
                                            onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} 
                                            className="w-full p-6 pr-14 bg-black border border-white/10 rounded-[28px] text-white font-black outline-none focus:border-emerald-500 appearance-none shadow-inner cursor-pointer"
                                        >
                                            {Object.values(Category).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                           </div>
                        </div>

                        {/* 2. Pricing Card */}
                        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl">
                           <div className="flex items-center gap-3 mb-8">
                                <DollarSign className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-black text-white">التسعير والعروض</h3>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-2">السعر الحالي (د.م)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            required 
                                            value={currentProduct.price || ''} 
                                            onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} 
                                            className="w-full p-6 bg-black border border-emerald-500/20 rounded-[28px] text-emerald-500 font-black text-3xl outline-none focus:border-emerald-500 shadow-xl text-center" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">السعر القديم (د.م)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={currentProduct.oldPrice || ''} 
                                            onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} 
                                            className="w-full p-6 bg-black border border-white/10 rounded-[28px] text-gray-500 font-black text-3xl outline-none focus:border-emerald-500 shadow-xl text-center" 
                                        />
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: MEDIA CENTER (5 Columns) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Images className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-black text-white">صور المنتج</h3>
                            </div>

                            {/* Main Image Uploader */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">الصورة الأساسية</label>
                                <div 
                                  onClick={() => mainImageInputRef.current?.click()}
                                  className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                                    ${currentProduct.imageUrl ? 'border-emerald-500/30 bg-black' : 'border-white/10 hover:border-emerald-500/40 bg-black/40'}`}
                                >
                                  {currentProduct.imageUrl ? (
                                    <>
                                      <img src={currentProduct.imageUrl} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <span className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black text-sm">تغيير الصورة</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center p-8">
                                      <UploadCloud size={48} className="text-emerald-500 mx-auto mb-4 opacity-40" />
                                      <p className="text-xs text-gray-400 font-bold">رفع الصورة الرئيسية</p>
                                    </div>
                                  )}
                                  <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                                </div>
                            </div>

                            {/* Additional Images Grid */}
                            <div className="mt-10 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">معرض الصور الإضافي</label>
                                    <span className="text-[10px] text-emerald-500 font-black">{(currentProduct.additionalImages || []).length} / 6</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  {(currentProduct.additionalImages || []).map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/5 bg-black">
                                      <img src={img} className="w-full h-full object-cover" />
                                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 size={20}/></button>
                                    </div>
                                  ))}
                                  {(currentProduct.additionalImages || []).length < 6 && (
                                    <button 
                                      type="button" 
                                      onClick={() => galleryImageInputRef.current?.click()} 
                                      className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:text-emerald-500 hover:border-emerald-500/40 transition-all bg-black group"
                                    >
                                      <ImagePlus size={24} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                  )}
                                </div>
                                <input type="file" ref={galleryImageInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: DESCRIPTION (Full Width) */}
                  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-8">
                      <div className="flex items-center gap-3">
                          <FileText className="text-emerald-500" size={24} />
                          <h3 className="text-xl font-black text-white">وصف المنتج وتفاصيله</h3>
                      </div>
                      <div className="border-2 border-white/10 rounded-[32px] bg-black overflow-hidden focus-within:border-emerald-500 transition-all shadow-inner">
                          <textarea 
                              required
                              rows={10}
                              value={currentProduct.description || ''} 
                              onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} 
                              className="w-full p-8 bg-transparent text-gray-300 text-lg leading-relaxed outline-none resize-none overflow-y-auto scrollbar-hide" 
                              placeholder="اشرح هنا للزبون مميزات هذا المنتج ولماذا يجب عليه شراءه..."
                          ></textarea>
                      </div>
                  </div>

                </form>
              </div>

              {/* Action Bar */}
              <div className="px-10 py-8 bg-black/90 backdrop-blur-xl border-t border-white/5 flex gap-4">
                  <button type="submit" form="productForm" className="flex-1 bg-emerald-500 text-black py-6 rounded-[32px] font-black text-2xl shadow-3xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-4">
                    <CheckCircle2 size={32} /> {currentProduct.id ? 'حفظ التغييرات' : 'نشر هذا المنتج'}
                  </button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="px-12 bg-white/5 text-gray-400 rounded-[32px] font-black hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input type="text" placeholder="ابحث عن زبون..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-14 pl-6 py-5 bg-[#0a0a0a] border border-white/5 rounded-3xl text-white outline-none focus:border-emerald-500 font-bold transition-all shadow-xl" />
            </div>
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-x-auto shadow-2xl">
              <table className="w-full text-right min-w-[800px]">
                <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="p-6">الزبون</th>
                    <th className="p-6">المدينة</th>
                    <th className="p-6">القيمة</th>
                    <th className="p-6">الحالة</th>
                    <th className="p-6 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.filter(o => o.customer.fullName.includes(orderSearch) || o.customer.phone.includes(orderSearch)).map(order => (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-6">
                        <div className="font-black text-white text-base">{order.customer.fullName}</div>
                        <div className="text-emerald-500 text-[11px] font-mono mt-0.5">{order.customer.phone}</div>
                      </td>
                      <td className="p-6 text-gray-400 font-bold text-sm">{order.customer.city}</td>
                      <td className="p-6 text-white font-black text-lg">{order.total} د.م</td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => { if(confirm('حذف الطلب؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Content */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-[40px] border border-emerald-500/20 shadow-4xl text-center">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center justify-center gap-4"><Smartphone className="text-emerald-500"/> مزامنة الهاتف</h2>
              <div className="bg-white p-6 rounded-[32px] inline-block mb-8 shadow-2xl">
                  <img src={qrImageUrl} className="w-[280px] h-[280px]" alt="Sync QR" />
              </div>
              <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ الكود!'); }} className="w-full max-sm mx-auto py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Copy size={20}/> نسخ كود المزامنة
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600"></div>
                <h2 className="text-xl font-black text-white flex items-center gap-3"><Megaphone className="text-blue-500"/> التتبع والإعلانات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Facebook Pixel ID</label>
                    <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="123456789" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Google AdSense ID</label>
                    <input type="text" value={localSettings.googleAdsenseId || ''} onChange={(e) => setLocalSettings({...localSettings, googleAdsenseId: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm outline-none focus:border-amber-500" placeholder="ca-pub-..." />
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-600"></div>
                <h2 className="text-xl font-black text-white flex items-center gap-3"><KeyRound className="text-rose-500"/> الأمان</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">كلمة سر جديدة</label>
                    <input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm outline-none focus:border-rose-500" placeholder="اتركها فارغة لعدم التغيير" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">تأكيد كلمة السر</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-sm outline-none focus:border-rose-500" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Save size={24} /> حفظ الإعدادات
              </button>
            </form>
          </div>
        )}

        {/* Sync Modal */}
        {showQRModal && activeTab !== 'settings' && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
             <div className="bg-[#111] p-10 rounded-[48px] border border-white/10 max-w-lg w-full text-center relative shadow-4xl animate-in fade-in zoom-in duration-300">
                <button onClick={() => setShowQRModal(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={32}/></button>
                <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">مزامنة البيانات</h2>
                <div className="bg-white p-6 rounded-[40px] mb-10 inline-block shadow-[0_0_80px_rgba(16,185,129,0.2)]">
                    <img src={qrImageUrl} className="w-[300px] h-[300px]" alt="Sync QR Large" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ الكود!'); }} className="py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <Copy size={20}/> نسخ الكود
                  </button>
                  <button onClick={() => window.print()} className="py-5 bg-white/5 text-white rounded-2xl font-black flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all">
                      <Download size={20}/> طباعة
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
