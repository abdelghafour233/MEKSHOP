
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus, OrderForm } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Package, LogOut, Search, Save, 
  LayoutDashboard, Smartphone, QrCode, KeyRound, Megaphone, 
  ImagePlus, UploadCloud, Copy, Download, Eye, EyeOff, Info, 
  Images, Tag, DollarSign, AlignRight, CheckCircle2, FileText, 
  Layers, ChevronLeft, CreditCard, Settings, User, MapPin, Phone,
  Clock, CheckCircle, Truck, XCircle, BarChart3, Globe, Code2
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, deleteOrder, updateOrderDetails } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  // Product States
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS,
    description: '', features: [], additionalImages: [], imageUrl: ''
  });
  
  // Order States
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  const [orderSearch, setOrderSearch] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

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
    <div className="min-h-screen bg-[#050505] py-6 md:py-12 pb-24 text-right" dir="rtl">
      <div className="max-w-[1300px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
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

        {/* Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-[32px] border border-white/5 mb-10 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black transition-all text-sm flex items-center justify-center gap-3 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? <CreditCard size={18}/> : tab === 'products' ? <Package size={18}/> : <Settings size={18}/>}
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative group">
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={24} />
              <input type="text" placeholder="ابحث باسم الزبون أو رقم الهاتف..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-16 pl-8 py-6 bg-[#0a0a0a] border border-white/5 rounded-[32px] text-white outline-none focus:border-emerald-500 font-bold transition-all shadow-xl text-lg" />
            </div>
            <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[950px]">
                  <thead className="bg-black/60 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="p-8">الزبون والمعلومات</th>
                      <th className="p-8">المدينة</th>
                      <th className="p-8">المبلغ</th>
                      <th className="p-8">الحالة</th>
                      <th className="p-8 text-center">الإجراءات</th>
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
                        <td className="p-8 text-white font-black text-xl">{order.total} د.م</td>
                        <td className="p-8">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-8 text-center">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => { setCurrentOrder(order); setIsEditingOrder(true); }} className="p-4 bg-white/5 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5" title="تعديل الطلب"><Edit size={18} /></button>
                            <button onClick={() => { if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) deleteOrder(order.id) }} className="p-4 bg-white/5 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-white/5" title="حذف الطلب"><Trash2 size={18} /></button>
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

        {/* MODAL: ORDER EDITOR */}
        {isEditingOrder && currentOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[2000] flex items-center justify-center p-4 overflow-hidden">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl rounded-[48px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-10 py-7 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><CreditCard size={28}/></div>
                        <h2 className="text-2xl font-black text-white">تعديل الطلب #{currentOrder.id.split('-')[1]}</h2>
                    </div>
                    <button onClick={() => setIsEditingOrder(false)} className="p-3 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                    {/* Customer Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">اسم الزبون</label>
                            <div className="relative">
                                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                <input 
                                    type="text" 
                                    value={currentOrder.customer.fullName} 
                                    onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, fullName: e.target.value}})}
                                    className="w-full p-5 pr-14 bg-black border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">رقم الهاتف</label>
                            <div className="relative">
                                <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                <input 
                                    type="text" 
                                    value={currentOrder.customer.phone} 
                                    onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, phone: e.target.value}})}
                                    className="w-full p-5 pr-14 bg-black border border-white/10 rounded-2xl text-white font-mono text-left outline-none focus:border-emerald-500 transition-all"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">المدينة</label>
                            <div className="relative">
                                <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                <input 
                                    type="text" 
                                    value={currentOrder.customer.city} 
                                    onChange={(e) => setCurrentOrder({...currentOrder, customer: {...currentOrder.customer, city: e.target.value}})}
                                    className="w-full p-5 pr-14 bg-black border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">حالة الطلب</label>
                            <div className="relative">
                                <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                <select 
                                    value={currentOrder.status} 
                                    onChange={(e) => setCurrentOrder({...currentOrder, status: e.target.value as OrderStatus})}
                                    className="w-full p-5 pr-14 bg-black border border-white/10 rounded-2xl text-white font-black outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                >
                                    <option value="Pending">قيد الانتظار</option>
                                    <option value="Confirmed">تم التأكيد</option>
                                    <option value="Shipped">تم الشحن</option>
                                    <option value="Cancelled">ملغى</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-black/40 rounded-[32px] border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 font-black text-gray-400 text-sm">المنتجات المطلوبة</div>
                        <div className="p-6 space-y-4">
                            {currentOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <div className="text-white font-bold text-sm">{item.title}</div>
                                            <div className="text-gray-500 text-xs">الكمية: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="text-emerald-500 font-black">{item.price * item.quantity} د.م</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-white/5 flex justify-between items-center">
                            <span className="text-gray-400 font-bold">المجموع الإجمالي</span>
                            <span className="text-emerald-500 font-black text-2xl">{currentOrder.total} د.م</span>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 border-t border-white/5 flex gap-4">
                    <button 
                        onClick={() => { updateOrderDetails(currentOrder); setIsEditingOrder(false); alert('✅ تم تحديث بيانات الطلب!'); }} 
                        className="flex-1 bg-emerald-500 text-black py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        <CheckCircle size={24}/> حفظ التغييرات
                    </button>
                    <button onClick={() => setIsEditingOrder(false)} className="px-10 bg-white/5 text-gray-400 rounded-[24px] font-black hover:bg-white/10 transition-all">إلغاء</button>
                </div>
            </div>
          </div>
        )}

        {/* Products List Content */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <button onClick={() => { setCurrentProduct({ title: '', price: 0, oldPrice: 0, category: Category.ELECTRONICS, description: '', additionalImages: [], imageUrl: '' }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-400 transition-all active:scale-95 group">
              <Plus size={24} className="group-hover:rotate-90 transition-transform" /> إضافة منتج جديد
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
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all border border-white/5"><Edit size={16} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all hover:text-white border border-white/5"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: PRODUCT EDITOR */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[1000] flex items-center justify-center p-2 md:p-8 overflow-hidden">
            <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-7xl rounded-[48px] shadow-4xl animate-in zoom-in duration-300 flex flex-col max-h-[92vh]">
              <div className="flex items-center justify-between px-10 py-7 border-b border-white/5">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Package size={32}/></div>
                  <h2 className="text-2xl font-black text-white">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج'}</h2>
                </div>
                <button onClick={() => setIsEditingProduct(false)} className="p-4 bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                <form id="productForm" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(!currentProduct.imageUrl) { alert("المرجو رفع صورة رئيسية"); return; }
                  if(currentProduct.id) updateProduct(currentProduct as Product); 
                  else addProduct({...currentProduct, id: Date.now().toString()} as Product); 
                  setIsEditingProduct(false); 
                }} className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] shadow-xl">
                            <h3 className="text-lg font-black text-white mb-6">الصورة الرئيسية</h3>
                            <div onClick={() => mainImageInputRef.current?.click()} className="aspect-square rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group">
                              {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover" /> : <UploadCloud size={64} className="text-emerald-500 opacity-40" />}
                              <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px]">
                            <h3 className="text-lg font-black text-white mb-6">المعرض الإضافي</h3>
                            <div className="grid grid-cols-3 gap-4">
                              {(currentProduct.additionalImages || []).map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/5">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Trash2 size={24}/></button>
                                </div>
                              ))}
                              {(currentProduct.additionalImages || []).length < 6 && (
                                <button type="button" onClick={() => galleryImageInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:text-emerald-500 bg-black/50 transition-all"><Plus size={32} /></button>
                              )}
                            </div>
                            <input type="file" ref={galleryImageInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" accept="image/*" />
                        </div>
                    </div>
                    <div className="lg:col-span-7 space-y-10">
                        <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] space-y-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">اسم المنتج</label>
                                <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-6 bg-black border border-white/10 rounded-[28px] text-white font-black text-2xl outline-none focus:border-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mr-2">السعر الحالي</label>
                                    <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-6 bg-black border border-emerald-500/20 rounded-[28px] text-emerald-500 font-black text-3xl outline-none focus:border-emerald-500 text-center" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest mr-2">السعر القديم</label>
                                    <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-6 bg-black border border-white/10 rounded-[28px] text-gray-500 font-black text-3xl outline-none focus:border-emerald-500 text-center" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">التصنيف</label>
                                <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-6 bg-black border border-white/10 rounded-[28px] text-white font-black text-lg outline-none focus:border-emerald-500 appearance-none shadow-inner cursor-pointer">
                                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] space-y-8">
                            <h3 className="text-2xl font-black text-white">وصف المنتج</h3>
                            <textarea required rows={8} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-10 bg-black border border-white/10 rounded-[40px] text-gray-300 text-xl leading-relaxed outline-none focus:border-emerald-500 scrollbar-hide" />
                        </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-10 py-8 bg-black/90 backdrop-blur-2xl border-t border-white/10 flex gap-4">
                  <button type="submit" form="productForm" className="flex-1 bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-3xl shadow-emerald-500/40 active:scale-95 transition-all flex items-center justify-center gap-4">
                    <CheckCircle2 size={32} /> {currentProduct.id ? 'حفظ التغييرات' : 'نشر المنتج'}
                  </button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="px-14 bg-white/5 text-gray-400 rounded-[32px] font-black hover:bg-white/10 transition-all border border-white/5">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content */}
        {activeTab === 'settings' && (
          <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
            {/* Sync QR Section */}
            <div className="bg-[#0a0a0a] p-10 md:p-16 rounded-[56px] border border-emerald-500/20 shadow-4xl text-center">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center justify-center gap-5"><Smartphone className="text-emerald-500" size={32}/> مزامنة الهاتف</h2>
              <div className="bg-white p-8 rounded-[48px] inline-block mb-10 shadow-3xl border-8 border-emerald-500/10">
                  <img src={qrImageUrl} className="w-[320px] h-[320px]" alt="Sync QR" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم النسخ!'); }} className="w-full sm:w-auto px-12 py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={20}/> نسخ كود البيانات
                  </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateSettings(localSettings); alert("✅ تم حفظ الإعدادات بنجاح!"); }} className="space-y-10">
              {/* Marketing & Tracking Section */}
              <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-2xl font-black text-white flex items-center gap-4 border-r-4 border-blue-500 pr-6">
                    <BarChart3 className="text-blue-500" size={24}/> التتبع والتسويق الرقمي
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Facebook Pixel */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                        <Globe size={14}/> Facebook Pixel ID
                    </label>
                    <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-blue-500 shadow-inner" placeholder="مثال: 1234567890" />
                  </div>

                  {/* Facebook Test Event Code (THE MISSING FIELD) */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                        <Code2 size={14}/> FB Test Event Code
                    </label>
                    <input type="text" value={localSettings.fbTestEventCode || ''} onChange={(e) => setLocalSettings({...localSettings, fbTestEventCode: e.target.value})} className="w-full p-5 bg-black border border-emerald-500/20 rounded-2xl text-emerald-500 font-mono outline-none focus:border-emerald-500 shadow-inner" placeholder="مثال: TEST12345" />
                  </div>

                  {/* Google Tag ID */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                        <Globe size={14}/> Google Tag ID (G-XXXX)
                    </label>
                    <input type="text" value={localSettings.googleTagId || ''} onChange={(e) => setLocalSettings({...localSettings, googleTagId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-amber-500 shadow-inner" placeholder="G-XXXXXXXXXX" />
                  </div>

                  {/* TikTok Pixel */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                        <Globe size={14}/> TikTok Pixel ID
                    </label>
                    <input type="text" value={localSettings.tiktokPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, tiktokPixelId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-rose-500 shadow-inner" placeholder="مثال: C6XXXXXXXXXX" />
                  </div>

                  {/* Google AdSense */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-2">
                        <Globe size={14}/> Google AdSense Client ID
                    </label>
                    <input type="text" value={localSettings.googleAdsenseId || ''} onChange={(e) => setLocalSettings({...localSettings, googleAdsenseId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-amber-500 shadow-inner" placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                  </div>
                </div>
              </div>

              {/* Data Export Section */}
              <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white border-r-4 border-emerald-500 pr-6">تخزين البيانات الخارجية</h2>
                <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mr-2">Google Sheets Webhook URL</label>
                    <input type="text" value={localSettings.googleSheetUrl || ''} onChange={(e) => setLocalSettings({...localSettings, googleSheetUrl: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-emerald-500 shadow-inner" placeholder="https://script.google.com/macros/s/..." />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-3xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-4">
                <Save size={32} /> حفظ كافة الإعدادات
              </button>
            </form>
          </div>
        )}

        {/* QR Sync Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[3000] flex items-center justify-center p-4">
             <div className="bg-[#111] p-12 rounded-[56px] border border-white/10 max-w-xl w-full text-center relative shadow-4xl animate-in zoom-in duration-300">
                <button onClick={() => setShowQRModal(false)} className="absolute top-10 left-10 text-gray-500 hover:text-white transition-colors p-3 bg-white/5 rounded-full"><X size={32}/></button>
                <div className="bg-white p-8 rounded-[48px] mb-12 inline-block shadow-3xl">
                    <img src={qrImageUrl} className="w-[300px] h-[300px]" alt="Sync QR" />
                </div>
                <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم النسخ!'); }} className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                      <Copy size={22}/> نسخ الكود للمزامنة
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
    case 'Pending': return 'قيد الانتظار';
    case 'Confirmed': return 'تم التأكيد';
    case 'Shipped': return 'تم الشحن';
    case 'Cancelled': return 'ملغى';
    default: return status;
  }
};

export default Admin;
