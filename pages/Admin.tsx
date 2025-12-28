
import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
// Fix: Added missing User import from lucide-react to resolve "Cannot find name 'User'" error
import { 
  Plus, Edit, Trash2, X, Lock, Settings as SettingsIcon, 
  Package, LogOut, Eye, EyeOff, ShoppingBag, 
  Search, Hash, DollarSign, Clock, ClipboardList, Award, Truck, AlertCircle,
  Link as LinkIcon, Database, Facebook, Chrome, Target, MapPin, Shield, Upload, 
  Image as ImageIcon, TrendingUp, User, Users, Activity, CheckCircle2,
  Phone, ShoppingCart, Code2, ShieldAlert, Save, FileText
} from 'lucide-react';

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أغادير", "مكناس", "وجدة",
  "القنيطرة", "تطوان", "تمارة", "آسفي", "العيون", "المحمدية", "بني ملال", "الجديدة",
  "تازة", "الناظور", "سطات", "القصر الكبير", "العرائش", "خميسات", "تيزنيت", "برشيد",
  "وادي زم", "الفقيه بن صالح", "تاوريرت", "بركان", "سيدي سليمان", "الرشيدية", "سيدي قاسم", "خنيفرة"
].sort();

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, updateOrderDetails, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const [orderSearch, setOrderSearch] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Settings Local State
  const [localSettings, setLocalSettings] = useState(settings);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const categoryLabels: Record<Category, string> = {
    [Category.ELECTRONICS]: 'إلكترونيات',
    [Category.CAR_ACCESSORIES]: 'إكسسوارات سيارات',
    [Category.WATCHES]: 'ساعات',
    [Category.GLASSES]: 'نظارات',
    [Category.OTHER]: 'أخرى',
  };

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
    updateSettings(localSettings);
    alert("✅ تم حفظ الإعدادات بنجاح!");
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setCurrentProduct(prev => ({ ...prev, imageUrl: base64 }));
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
    setCurrentProduct(prev => ({ 
      ...prev, 
      additionalImages: [...(prev.additionalImages || []), ...base64Images] 
    }));
  };

  const removeGalleryImage = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      additionalImages: (prev.additionalImages || []).filter((_, i) => i !== index)
    }));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.title || !currentProduct.price || !currentProduct.imageUrl) {
      alert("المرجو ملء جميع الحقول الأساسية ورفع صورة رئيسية");
      return;
    }

    if (currentProduct.id) {
      updateProduct(currentProduct as Product);
      alert("✅ تم تحديث المنتج");
    } else {
      const newProduct = {
        ...currentProduct,
        id: `p-${Date.now()}`,
        additionalImages: currentProduct.additionalImages || [],
        features: currentProduct.features || [],
      } as Product;
      addProduct(newProduct);
      alert("✅ تم إضافة المنتج بنجاح");
    }
    setIsEditingProduct(false);
    setCurrentProduct({});
  };

  const handleOrderSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrderDetails(editingOrder);
      alert("✅ تم تحديث بيانات الطلب");
      setEditingOrder(null);
    }
  };

  const dashboardStats = useMemo(() => {
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    return {
      totalRevenue,
      pendingCount,
      totalOrders: orders.length,
      productCount: products.length
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || 
        o.customer.phone.includes(orderSearch) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
          case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Shipped': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
          case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
          default: return 'bg-slate-500/10 text-slate-500';
      }
  };

  const getStatusLabel = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'قيد الانتظار';
          case 'Confirmed': return 'تم التأكيد';
          case 'Shipped': return 'تم الشحن';
          case 'Cancelled': return 'ملغى';
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-8 md:p-14 rounded-[40px] md:rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">بريمة ستور</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور"
                className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-gray-700 shadow-inner"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-500 transition-colors p-2">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-xl">
                    <ShoppingBag className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">لوحة الإدارة</h1>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Berrima Control Center</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Link to="/" className="flex-1 md:flex-none text-center bg-white/5 text-white px-6 py-4 rounded-xl border border-white/5 font-black hover:bg-emerald-500 hover:text-black transition-all text-sm">معاينة المتجر</Link>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-6 py-4 rounded-xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all text-sm">خروج</button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {[
             { label: 'المبيعات', value: `${dashboardStats.totalRevenue} د.م`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'جديدة', value: dashboardStats.pendingCount, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'الطلبات', value: dashboardStats.totalOrders, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: 'المنتجات', value: dashboardStats.productCount, color: 'text-purple-500', bg: 'bg-purple-500/10' },
           ].map((stat, i) => (
             <div key={i} className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/5 shadow-lg">
               <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
               <h3 className={`text-xl font-black ${stat.color}`}>{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Tabs */}
        <div className="bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5 mb-8 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] py-3.5 rounded-xl font-black transition-all text-xs ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Contents */}
        {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-500">
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input type="text" placeholder="ابحث عن زبون أو معرف الطلب..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-12 pl-4 py-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-white outline-none focus:border-emerald-500 font-bold" />
                </div>
                <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-x-auto shadow-2xl">
                    <table className="w-full text-right min-w-[700px]">
                        <thead className="bg-black/50 text-gray-500 text-[9px] font-black uppercase border-b border-white/5">
                            <tr>
                                <th className="p-5">التاريخ</th>
                                <th className="p-5">المعرف</th>
                                <th className="p-5">الزبون</th>
                                <th className="p-5">القيمة</th>
                                <th className="p-5">الحالة</th>
                                <th className="p-5 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-5 text-gray-500 text-[10px]">{new Date(order.date).toLocaleDateString('ar-MA')}</td>
                                    <td className="p-5 text-white font-mono text-xs opacity-40">#{order.id.split('-')[1]}</td>
                                    <td className="p-5">
                                        <div className="font-black text-white text-sm">{order.customer.fullName}</div>
                                        <div className="text-emerald-500 text-[10px] font-mono">{order.customer.phone}</div>
                                    </td>
                                    <td className="p-5 text-white font-black">{order.total} د.م</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                          <button onClick={() => setEditingOrder(order)} className="p-2.5 bg-white/5 text-white rounded-lg hover:bg-emerald-500 hover:text-black transition-all shadow-sm" title="معاينة وتحرير">
                                            <Edit size={16} />
                                          </button>
                                          <button onClick={() => { if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) deleteOrder(order.id) }} className="p-2.5 bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-lg shadow-sm" title="حذف الطلب">
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg">
              <Plus size={18} /> إضافة منتج جديد
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-xl group hover:border-emerald-500/30 transition-all">
                  <div className="aspect-[4/3] bg-black overflow-hidden relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                      {categoryLabels[product.category] || product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-black text-sm mb-3 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-500 font-black text-base">{product.price} د.م</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-2 bg-white/5 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Edit size={14} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-2 bg-white/5 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* FB Pixel */}
              <div className="bg-[#0a0a0a] p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Facebook size={24} /></div>
                  <div>
                    <h2 className="text-xl font-black text-white">فيسبوك بيكسل</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">تتبع المبيعات والزيارات</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Facebook Pixel ID</label>
                    <input type="text" value={localSettings.facebookPixelId} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="ID هنا..." />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Test Event Code</label>
                    <input type="text" value={localSettings.fbTestEventCode} onChange={(e) => setLocalSettings({...localSettings, fbTestEventCode: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="مثال: TEST12345" />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#0a0a0a] p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-600"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-rose-600/10 text-rose-500 rounded-2xl"><Shield size={24} /></div>
                  <div>
                    <h2 className="text-xl font-black text-white">الأمان</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">إدارة كلمة سر لوحة التحكم</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Google Sheet URL (POST)</label>
                    <input type="url" value={localSettings.googleSheetUrl} onChange={(e) => setLocalSettings({...localSettings, googleSheetUrl: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-500" placeholder="رابط سكربت جوجل..." />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">كلمة السر الجديدة</label>
                    <input type="text" value={localSettings.adminPassword} onChange={(e) => setLocalSettings({...localSettings, adminPassword: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-rose-500" placeholder="كلمة السر..." />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-[24px] font-black text-xl shadow-xl shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 size={24} /> حفظ الإعدادات
              </button>
            </form>
          </div>
        )}

        {/* ORDER MODAL - PREVIEW & EDIT */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[150] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><ClipboardList size={20} /></div>
                <h2 className="text-lg md:text-xl font-black text-white">تفاصيل الطلب <span className="opacity-40 text-xs font-mono ml-2">#{editingOrder.id.split('-')[1]}</span></h2>
              </div>
              <button onClick={() => setEditingOrder(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
                <form onSubmit={handleOrderSave} className="max-w-4xl mx-auto space-y-8">
                  
                  {/* Customer Information (Editable) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 space-y-6">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><User size={14}/> معلومات الزبون</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] text-gray-600 mb-1 font-bold">الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    value={editingOrder.customer.fullName} 
                                    onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})}
                                    className="w-full p-3 bg-black border border-white/10 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] text-gray-600 mb-1 font-bold">رقم الهاتف</label>
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        value={editingOrder.customer.phone} 
                                        onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, phone: e.target.value}})}
                                        className="w-full p-3 bg-black border border-white/10 rounded-xl text-emerald-500 font-mono text-lg outline-none focus:border-emerald-500"
                                    />
                                    <a href={`tel:${editingOrder.customer.phone}`} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Phone size={14}/></a>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] text-gray-600 mb-1 font-bold">المدينة</label>
                                <select 
                                    value={editingOrder.customer.city} 
                                    onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, city: e.target.value}})}
                                    className="w-full p-3 bg-black border border-white/10 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                                >
                                    {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Truck size={14}/> حالة الطلب</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                              <button 
                                key={s} 
                                type="button"
                                onClick={() => setEditingOrder({...editingOrder, status: s})} 
                                className={`py-3 rounded-xl text-[10px] font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-current' : 'text-gray-800 border-white/5'}`}
                              >
                                {getStatusLabel(s)}
                              </button>
                            ))}
                        </div>

                        <div className="mt-auto">
                           <label className="block text-[9px] text-gray-600 mb-2 font-bold flex items-center gap-2"><FileText size={12}/> ملاحظات الإدارة (خاصة)</label>
                           <textarea 
                              rows={3} 
                              value={editingOrder.notes || ''} 
                              onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                              className="w-full p-3 bg-black border border-white/10 rounded-xl text-white font-medium text-sm resize-none outline-none focus:border-emerald-500"
                              placeholder="أضف ملاحظة هنا..."
                           />
                        </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ShoppingCart size={14}/> السلة والمجموع</p>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                      {editingOrder.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between bg-black p-4 rounded-xl border border-white/5 group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                <img src={it.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h5 className="text-white font-black text-sm">{it.title}</h5>
                                <p className="text-gray-600 text-[10px] font-bold">الكمية: {it.quantity} × {it.price} د.م</p>
                            </div>
                          </div>
                          <span className="text-emerald-500 font-black text-base">{it.price * it.quantity} د.م</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-black text-[9px] uppercase tracking-widest mb-1">المجموع الكلي</span>
                        <span className="text-3xl font-black text-emerald-500">{editingOrder.total} د.م</span>
                      </div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                        الدفع عند الاستلام (COD)
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 pb-20 flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-1 bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                      <Save size={20} /> حفظ جميع التغييرات
                    </button>
                    <button type="button" onClick={() => setEditingOrder(null)} className="sm:px-10 py-5 bg-white/5 text-white rounded-2xl font-black text-lg border border-white/10">إلغاء</button>
                    <button type="button" onClick={() => { if(confirm('حذف الطلب نهائياً؟')) { deleteOrder(editingOrder.id); setEditingOrder(null); } }} className="sm:px-6 py-5 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={24} />
                    </button>
                  </div>
                </form>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black z-[150] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Package className="text-emerald-500" size={20} />
                {currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج'}
              </h2>
              <button onClick={() => setIsEditingProduct(false)} className="p-2 bg-white/10 rounded-full text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-black">
              <form onSubmit={handleProductSubmit} className="max-w-4xl mx-auto space-y-8">
                <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-emerald-500/30">
                  <label className="block text-[11px] font-black text-emerald-500 mb-3 uppercase tracking-[0.2em]">اسم المنتج *</label>
                  <input required autoFocus value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 font-black text-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/5">
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">السعر الحالي</label>
                    <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-3 bg-black border border-white/10 rounded-xl text-emerald-500 font-black text-xl" />
                  </div>
                  <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/5">
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">السعر القديم</label>
                    <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-3 bg-black border border-white/10 rounded-xl text-gray-600 font-black text-xl" />
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/5">
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">التصنيف</label>
                  <select value={currentProduct.category || Category.ELECTRONICS} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-bold">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{categoryLabels[cat as Category]}</option>)}
                  </select>
                </div>

                <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/5">
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">الوصف</label>
                  <textarea rows={4} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-medium resize-none"></textarea>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/5">
                    <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-widest">الصورة الرئيسية</label>
                    <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                    <div onClick={() => mainImageInputRef.current?.click()} className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer">
                      {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover rounded-lg" /> : <Upload size={30} className="text-gray-600" />}
                    </div>
                  </div>
                </div>

                <div className="pt-6 pb-20 space-y-3">
                  <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg">حفظ المنتج</button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black text-lg">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
