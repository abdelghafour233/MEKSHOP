
import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Settings as SettingsIcon, 
  Package, LogOut, Eye, EyeOff, ShoppingBag, 
  Search, Hash, DollarSign, Clock, ClipboardList, Award, Truck, AlertCircle,
  Link as LinkIcon, Database, Facebook, Chrome, Target, MapPin, Shield, Upload, 
  Image as ImageIcon, TrendingUp, User, Users, Activity, CheckCircle2,
  Phone, ShoppingCart, Code2, ShieldAlert, Save, FileText, LayoutDashboard, Globe,
  RefreshCw, Copy, Download, UploadCloud, Laptop, Smartphone
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
  const [syncCode, setSyncCode] = useState('');

  const mainImageInputRef = useRef<HTMLInputElement>(null);

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

  // --- ميزة المزامنة الجديدة ---
  const generateSyncCode = () => {
    const data = {
      products,
      settings: localSettings
    };
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    setSyncCode(code);
    navigator.clipboard.writeText(code);
    alert("✅ تم توليد كود المزامنة ونسخه! أرسله لهاتفك وإلصقه هناك.");
  };

  const importDataFromCode = () => {
    if (!syncCode) return;
    try {
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(syncCode))));
      if (decodedData.products && decodedData.settings) {
        if (confirm('سيتم مسح البيانات الحالية واستبدالها بالبيانات الجديدة. هل أنت متأكد؟')) {
          localStorage.setItem('souqMaghrebProducts', JSON.stringify(decodedData.products));
          localStorage.setItem('souqMaghrebSettings', JSON.stringify(decodedData.settings));
          alert("✅ تمت المزامنة بنجاح! سيتم إعادة تحميل الصفحة لتطبيق التغييرات.");
          window.location.reload();
        }
      }
    } catch (e) {
      alert("❌ كود المزامنة غير صحيح.");
    }
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
      alert("✅ تم تحديث بيانات الطلب بنجاح");
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
        <div className="bg-[#0a0a0a] p-10 md:p-16 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 rotate-3 transition-transform shadow-2xl">
            <Lock className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">نظام الإدارة</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Berrima Private Access</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور"
                className="w-full p-6 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-gray-800 shadow-inner"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-emerald-500 transition-colors p-2">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-black text-xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">تأكيد الدخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-12 pb-24">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header Admin */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-[#0a0a0a] p-6 md:p-8 rounded-[40px] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-5">
                <div className="p-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <LayoutDashboard className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">غرفة التحكم</h1>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-70">Berrima Operations Center</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Link to="/" className="flex-1 md:flex-none text-center bg-white/5 text-white px-8 py-4 rounded-2xl border border-white/10 font-black hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2">
                    <Globe size={18} /> معاينة المتجر
                </Link>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-8 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                    <LogOut size={18} /> خروج
                </button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
           {[
             { label: 'إجمالي المبيعات', value: `${dashboardStats.totalRevenue} د.م`, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <DollarSign size={20}/> },
             { label: 'طلبات جديدة', value: dashboardStats.pendingCount, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <Clock size={20}/> },
             { label: 'إجمالي الطلبات', value: dashboardStats.totalOrders, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <ClipboardList size={20}/> },
             { label: 'المنتجات الحية', value: dashboardStats.productCount, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: <Package size={20}/> },
           ].map((stat, i) => (
             <div key={i} className="bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden group">
               <div className={`absolute -right-2 -bottom-2 opacity-5 scale-150 transition-transform group-hover:scale-[2] duration-700 ${stat.color}`}>{stat.icon}</div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</p>
               <h3 className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-[28px] border border-white/5 mb-10 flex gap-2 overflow-x-auto scrollbar-hide shadow-inner">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black transition-all text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/20 scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'orders' ? <ShoppingCart size={18}/> : tab === 'products' ? <Package size={18}/> : <SettingsIcon size={18}/>}
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Contents */}
        <div className="animate-in fade-in duration-700">
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <div className="relative group">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input type="text" placeholder="ابحث عن زبون أو هاتف..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-16 pl-6 py-6 bg-[#0a0a0a] border border-white/5 rounded-[28px] text-white outline-none focus:border-emerald-500 font-bold transition-all shadow-xl" />
                    </div>
                    
                    <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right min-w-[800px]">
                              <thead className="bg-black/80 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                  <tr>
                                      <th className="p-6">المعرف</th>
                                      <th className="p-6">الزبون</th>
                                      <th className="p-6">المدينة</th>
                                      <th className="p-6">القيمة</th>
                                      <th className="p-6">الحالة</th>
                                      <th className="p-6 text-center">الإجراءات</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                  {filteredOrders.map(order => (
                                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                          <td className="p-6 text-white font-mono text-xs opacity-30 group-hover:opacity-100">#{order.id.split('-')[1]}</td>
                                          <td className="p-6">
                                              <div className="font-black text-white text-base">{order.customer.fullName}</div>
                                              <div className="text-emerald-500 text-[11px] font-mono mt-0.5">{order.customer.phone}</div>
                                          </td>
                                          <td className="p-6 text-gray-400 font-bold">{order.customer.city}</td>
                                          <td className="p-6 text-white font-black text-lg">{order.total} د.م</td>
                                          <td className="p-6">
                                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                                  {getStatusLabel(order.status)}
                                              </span>
                                          </td>
                                          <td className="p-6">
                                              <div className="flex justify-center gap-3">
                                                <button onClick={() => setEditingOrder(order)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all shadow-sm"><Edit size={18} /></button>
                                                <button onClick={() => { if(confirm('حذف الطلب؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl shadow-sm"><Trash2 size={18} /></button>
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

            {activeTab === 'products' && (
              <div className="space-y-8">
                <button onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all">
                  <Plus size={24} /> إضافة منتج جديد للكتالوج
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl group hover:border-emerald-500/30 transition-all">
                      <div className="aspect-[4/3] bg-black relative overflow-hidden">
                        <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black text-emerald-500 uppercase">
                          {categoryLabels[product.category]}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-white font-black text-base mb-4 line-clamp-1">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-500 font-black text-xl">{product.price} <span className="text-[10px]">د.م</span></span>
                          <div className="flex gap-2">
                            <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all"><Edit size={16} /></button>
                            <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-5xl mx-auto space-y-10 pb-20">
                
                {/* --- قسم المزامنة بين الأجهزة (الحل لمشكلتك) --- */}
                <div className="bg-[#0a0a0a] p-10 rounded-[48px] border-2 border-emerald-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-[28px] border border-emerald-500/20 shadow-inner">
                                <RefreshCw size={32} className="animate-spin-slow" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">مزامنة المتجر بين الأجهزة</h2>
                                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">استخدم هذه الميزة لتوحيد المنتجات بين الحاسوب والهاتف</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button onClick={generateSyncCode} className="flex-1 bg-emerald-500 text-black px-8 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                                <Laptop size={18} /> توليد كود (من الحاسوب)
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-10 p-6 bg-black/50 rounded-3xl border border-white/5">
                        <label className="block text-[10px] font-black text-gray-600 mb-4 uppercase tracking-widest mr-2">أدخل كود المزامنة هنا (في الهاتف)</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" 
                                value={syncCode} 
                                onChange={(e) => setSyncCode(e.target.value)} 
                                placeholder="إلصق الكود الذي نسخته من الحاسوب هنا..." 
                                className="flex-1 p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-xs outline-none focus:border-emerald-500"
                            />
                            <button onClick={importDataFromCode} className="bg-white/5 text-white px-10 py-5 rounded-2xl font-black text-sm border border-white/10 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2">
                                <Smartphone size={18} /> تنفيذ المزامنة
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-10">
                  {/* FB Tracking Card */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl"><Facebook size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">إعدادات فيسبوك</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">تتبع المبيعات والبيكسل</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Pixel ID</label>
                        <input type="text" value={localSettings.facebookPixelId} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="0000000000" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Google Sheet URL</label>
                        <input type="url" value={localSettings.googleSheetUrl} onChange={(e) => setLocalSettings({...localSettings, googleSheetUrl: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-emerald-500" placeholder="https://script.google.com/..." />
                      </div>
                    </div>
                  </div>

                  {/* Security Card */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-rose-600"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-rose-600/10 text-rose-500 rounded-2xl"><Shield size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">إعدادات الأمان</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">كلمة سر لوحة التحكم</p>
                      </div>
                    </div>
                    <div className="max-w-md space-y-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">كلمة المرور الحالية</label>
                        <input type="text" value={localSettings.adminPassword} onChange={(e) => setLocalSettings({...localSettings, adminPassword: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-lg outline-none focus:border-rose-500 shadow-inner" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4">
                    <CheckCircle2 size={32} /> حفظ وتحديث المتجر
                  </button>
                </form>
              </div>
            )}
        </div>

        {/* MODALS */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><FileText size={24} /></div>
                <h2 className="text-xl md:text-2xl font-black text-white">تحرير الطلب <span className="text-xs opacity-40 ml-2">#{editingOrder.id.split('-')[1]}</span></h2>
              </div>
              <button onClick={() => setEditingOrder(null)} className="p-3 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-black">
                <form onSubmit={handleOrderSave} className="max-w-5xl mx-auto space-y-10 pb-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 space-y-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><User size={16} className="text-emerald-500"/> بيانات الزبون</p>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-600 font-black mr-2">الاسم الكامل</label>
                                <input type="text" value={editingOrder.customer.fullName} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-black outline-none focus:border-emerald-500 shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-600 font-black mr-2">رقم الهاتف</label>
                                <input type="tel" value={editingOrder.customer.phone} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, phone: e.target.value}})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-emerald-500 font-mono text-xl outline-none focus:border-emerald-500 shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-600 font-black mr-2">المدينة</label>
                                <select value={editingOrder.customer.city} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, city: e.target.value}})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-black outline-none focus:border-emerald-500 shadow-inner appearance-none">
                                    {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 flex flex-col space-y-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Truck size={16} className="text-emerald-500"/> حالة الطلب</p>
                        <div className="grid grid-cols-2 gap-3">
                            {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                              <button key={s} type="button" onClick={() => setEditingOrder({...editingOrder, status: s})} className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-emerald-500 scale-[1.05]' : 'text-gray-800 border-white/5 hover:border-white/20'}`}>{getStatusLabel(s)}</button>
                            ))}
                        </div>
                        <div className="mt-auto">
                           <label className="text-[10px] text-gray-600 font-black mb-3 block mr-2">ملاحظات الإدارة</label>
                           <textarea rows={4} value={editingOrder.notes || ''} onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-medium text-sm resize-none outline-none focus:border-emerald-500 shadow-inner" placeholder="سجل ملاحظاتك هنا..." />
                        </div>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3"><ShoppingCart size={16} className="text-emerald-500"/> محتويات الطلب</p>
                    <div className="space-y-4">
                      {editingOrder.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between bg-black p-5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10"><img src={it.imageUrl} className="w-full h-full object-cover" /></div>
                            <div>
                                <h5 className="text-white font-black text-base">{it.title}</h5>
                                <p className="text-emerald-500/50 text-[11px] font-black uppercase">الكمية: {it.quantity}</p>
                            </div>
                          </div>
                          <span className="text-emerald-500 font-black text-xl">{it.price * it.quantity} د.م</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/10">
                        <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest block mb-2">إجمالي الطلب</span>
                        <span className="text-4xl font-black text-emerald-500">{editingOrder.total} د.م</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-1 bg-emerald-500 text-black py-6 rounded-[28px] font-black text-xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4"><Save size={24} /> حفظ التعديلات</button>
                    <button type="button" onClick={() => { if(confirm('حذف نهائي؟')) { deleteOrder(editingOrder.id); setEditingOrder(null); } }} className="sm:px-10 py-6 bg-rose-500/10 text-rose-500 rounded-[28px] flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"><Trash2 size={24} /></button>
                  </div>
                </form>
            </div>
          </div>
        )}

        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Package size={24} /></div>
                <h2 className="text-xl md:text-2xl font-black text-white">{currentProduct.id ? 'تحرير المنتج' : 'إضافة منتج'}</h2>
              </div>
              <button onClick={() => setIsEditingProduct(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-black">
              <form onSubmit={handleProductSubmit} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="bg-[#0a0a0a] p-8 rounded-[40px] border-2 border-emerald-500/30">
                  <label className="block text-[11px] font-black text-emerald-500 mb-4 uppercase tracking-[0.3em]">اسم المنتج *</label>
                  <input required autoFocus value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white outline-none focus:border-emerald-500 font-black text-2xl shadow-inner" placeholder="اسم المنتج..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5"><label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">السعر (د.م)</label><input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-5 bg-black border border-white/10 rounded-[24px] text-emerald-500 font-black text-2xl outline-none focus:border-emerald-500" placeholder="0.00" /></div>
                  <div className="bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5"><label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">قبل التخفيض</label><input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-5 bg-black border border-white/10 rounded-[24px] text-gray-700 font-black text-2xl outline-none focus:border-rose-500" placeholder="اختياري" /></div>
                </div>
                <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
                  <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-widest">التصنيف</label>
                  <select value={currentProduct.category || Category.ELECTRONICS} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white font-black outline-none focus:border-emerald-500 shadow-inner appearance-none">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{categoryLabels[cat as Category]}</option>)}
                  </select>
                </div>
                <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
                  <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-widest">صور المنتج</label>
                  <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                  <div onClick={() => mainImageInputRef.current?.click()} className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all overflow-hidden">
                    {currentProduct.imageUrl ? <img src={currentProduct.imageUrl} className="w-full h-full object-cover" /> : <><Upload size={40} className="text-gray-800 mb-3 group-hover:text-emerald-500" /><p className="text-gray-600 font-black text-sm uppercase">اضغط للرفع</p></>}
                  </div>
                </div>
                <div className="pt-10 flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="flex-1 bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-2xl active:scale-95 transition-all">حفظ المنتج</button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="sm:px-12 py-7 bg-white/5 text-white rounded-[32px] font-black text-xl border border-white/10">إلغاء</button>
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
