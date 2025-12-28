
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
  Image as ImageIcon, TrendingUp, Users, Activity, CheckCircle2,
  // Added missing icons to fix "Cannot find name" errors
  Phone, ShoppingCart
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, updateOrderDetails, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const [orderSearch, setOrderSearch] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      alert("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    updateSettings({ ...settings, adminPassword: newPassword });
    alert("✅ تم تغيير كلمة السر بنجاح. يرجى استخدامها في المرة القادمة.");
    setNewPassword('');
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

  // Stats Logic
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
        <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Lock className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">بريمة ستور</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">نظام إدارة التجارة</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور"
                className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white text-center outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-gray-700 shadow-inner"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-500 transition-colors p-2"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black text-xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                دخول للنظام
            </button>
          </form>
          {settings.adminPassword === 'admin123' && (
            <p className="mt-8 text-gray-700 text-[10px] font-bold uppercase tracking-widest bg-white/5 py-2 rounded-full px-4 inline-block">Default: admin123</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8">
            <div className="flex items-center gap-6">
                <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl shadow-xl shadow-emerald-500/20">
                    <ShoppingBag className="w-9 h-9 text-black" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">لوحة الإدارة</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Berrima Store Professional v2.0</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-3 bg-white/5 text-white px-8 py-4 rounded-3xl border border-white/5 font-black hover:bg-emerald-500 hover:text-black transition-all group shadow-lg">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" /> معاينة المتجر
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 bg-rose-500/10 text-rose-500 px-8 py-4 rounded-3xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                    <LogOut className="w-5 h-5" /> خروج
                </button>
            </div>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'إجمالي المبيعات', value: `${dashboardStats.totalRevenue} د.م`, icon: <TrendingUp size={28}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'طلبات جديدة', value: dashboardStats.pendingCount, icon: <Activity size={28}/>, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'إجمالي الطلبات', value: dashboardStats.totalOrders, icon: <ClipboardList size={28}/>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: 'المنتجات النشطة', value: dashboardStats.productCount, icon: <Package size={28}/>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
           ].map((stat, i) => (
             <div key={i} className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
               <div className="flex justify-between items-start mb-4">
                 <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>{stat.icon}</div>
               </div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-white">{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Navigation Tabs - SaaS Style */}
        <div className="bg-[#0a0a0a] p-3 rounded-[32px] border border-white/5 mb-10 flex flex-wrap gap-2 shadow-2xl">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-5 rounded-[24px] font-black transition-all ${activeTab === tab ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20 scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'orders' && <ShoppingBag size={20} />}
                {tab === 'products' && <Package size={20} />}
                {tab === 'settings' && <SettingsIcon size={20} />}
                <span className="text-lg">{tab === 'orders' ? 'إدارة الطلبات' : tab === 'products' ? 'المتجر والمنتجات' : 'إعدادات النظام'}</span>
              </button>
            ))}
        </div>

        {/* Content Area */}
        {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative group">
                    <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="ابحث عن زبون، هاتف، أو رقم طلب..." 
                      value={orderSearch} 
                      onChange={(e) => setOrderSearch(e.target.value)} 
                      className="w-full pr-20 pl-8 py-7 bg-[#0a0a0a] border border-white/5 rounded-[40px] text-white outline-none focus:border-emerald-500 transition-all font-bold text-xl shadow-inner" 
                    />
                </div>
                <div className="bg-[#0a0a0a] rounded-[50px] border border-white/5 overflow-hidden shadow-3xl overflow-x-auto">
                    <table className="w-full text-right min-w-[900px]">
                        <thead className="bg-black/50 text-gray-500 text-[11px] font-black uppercase border-b border-white/5">
                            <tr>
                                <th className="p-8">المعرف</th>
                                <th className="p-8">الزبون والمعلومات</th>
                                <th className="p-8">قيمة الطلب</th>
                                <th className="p-8">حالة الطلبية</th>
                                <th className="p-8 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-8"><span className="text-white font-black text-lg opacity-60">#{order.id.split('-')[1]}</span></td>
                                    <td className="p-8">
                                        <div className="font-black text-white text-xl">{order.customer.fullName}</div>
                                        <div className="text-emerald-500 text-sm mt-1 font-mono flex items-center gap-2"><Phone size={14}/> {order.customer.phone}</div>
                                        <div className="text-gray-600 text-[10px] mt-1 font-bold uppercase tracking-widest">{order.customer.city}</div>
                                    </td>
                                    <td className="p-8 text-white font-black text-2xl">{order.total} <span className="text-xs text-gray-600">د.م</span></td>
                                    <td className="p-8">
                                        <span className={`px-6 py-2 rounded-2xl text-[11px] font-black border uppercase inline-flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center gap-3">
                                          <button onClick={() => setEditingOrder(order)} className="p-4 bg-white/5 text-white rounded-2xl hover:bg-emerald-500 hover:text-black transition-all shadow-lg"><Eye size={20} /></button>
                                          <button onClick={() => { if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) deleteOrder(order.id) }} className="p-4 bg-white/5 text-gray-500 hover:bg-rose-500 hover:text-white transition-all rounded-2xl shadow-lg"><Trash2 size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                               <tr>
                                 <td colSpan={5} className="p-20 text-center">
                                   <div className="text-gray-600 font-black text-xl">لا توجد طلبات مطابقة للبحث</div>
                                 </td>
                               </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-4">
                        <Package className="text-emerald-500" size={32} /> المنتجات الحالية ({products.length})
                    </h2>
                    <p className="text-gray-600 text-xs font-bold uppercase mt-1 tracking-widest">إدارة مخزون المتجر ومعلومات البيع</p>
                </div>
                <button 
                  onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }}
                  className="bg-emerald-500 text-black px-10 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                >
                  <Plus size={24} /> إضافة منتج جديد
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[45px] border border-white/5 overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-2xl relative">
                  <div className="aspect-[4/3] relative overflow-hidden bg-black">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-6 right-6 left-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
                      <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="flex-1 p-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"><Edit size={18} /> تعديل</button>
                      <button onClick={() => { if(confirm('حذف هذا المنتج؟')) deleteProduct(product.id) }} className="p-4 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
                    </div>
                    <div className="absolute top-6 right-6">
                        <span className="bg-black/60 backdrop-blur-md text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            {categoryLabels[product.category as Category] || product.category}
                        </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-white font-black text-xl mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.oldPrice && <span className="text-gray-600 text-xs line-through font-bold">{product.oldPrice} د.م</span>}
                        <span className="text-emerald-500 font-black text-2xl">{product.price} <span className="text-xs">د.م</span></span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl text-gray-500 group-hover:text-emerald-500 transition-colors">
                          <Package size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            
            {/* Security & Access */}
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[50px] border border-white/5 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2 h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]"></div>
              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-5">
                <Shield className="text-rose-500" size={36} /> إعدادات الأمان والوصول
              </h2>
              
              <div className="space-y-8 max-w-md">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mr-2">
                    <Lock size={14} className="text-rose-500" /> كلمة سر لوحة التحكم الجديدة
                  </label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة سر قوية ومميزة"
                      className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white font-mono outline-none focus:border-rose-500 transition-all shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-2"
                    >
                      {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleChangePassword}
                  className="w-full bg-rose-500 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-rose-500/20 active:scale-95 transition-all"
                >
                  تحديث بيانات الدخول
                </button>
                <p className="text-gray-600 text-[11px] font-bold text-center uppercase tracking-[0.2em] leading-relaxed">
                  سيتم اعتماد كلمة السر الجديدة فوراً لجميع الجلسات القادمة
                </p>
              </div>
            </div>

            {/* Tracking & Integration */}
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[50px] border border-white/5 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-5">
                <Target className="text-emerald-500" size={36} /> أدوات التتبع والربط التقني
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3 mr-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg"><Facebook size={16} className="text-blue-500" /></div> Facebook Pixel ID
                  </label>
                  <input 
                    type="text" 
                    value={settings.facebookPixelId} 
                    onChange={(e) => updateSettings({...settings, facebookPixelId: e.target.value})}
                    placeholder="1234567890"
                    className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-emerald-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3 mr-2">
                    <div className="p-1.5 bg-amber-500/10 rounded-lg"><Award size={16} className="text-amber-500" /></div> FB Test Event Code
                  </label>
                  <input 
                    type="text" 
                    value={settings.fbTestEventCode} 
                    onChange={(e) => updateSettings({...settings, fbTestEventCode: e.target.value})}
                    placeholder="TEST12345"
                    className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-emerald-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3 mr-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Database size={16} className="text-emerald-500" /></div> Google Sheet Webhook
                  </label>
                  <input 
                    type="text" 
                    value={settings.googleSheetUrl} 
                    onChange={(e) => updateSettings({...settings, googleSheetUrl: e.target.value})}
                    placeholder="https://script.google.com/..."
                    className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-emerald-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3 mr-2">
                    <div className="p-1.5 bg-blue-400/10 rounded-lg"><Chrome size={16} className="text-blue-400" /></div> Google Tag ID (G-XXX)
                  </label>
                  <input 
                    type="text" 
                    value={settings.googleTagId} 
                    onChange={(e) => updateSettings({...settings, googleTagId: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-emerald-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/5 p-10 rounded-[40px] border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-right">
                  <h4 className="text-white text-2xl font-black mb-1 flex items-center gap-3">تطبيق التغييرات <CheckCircle2 className="text-emerald-500" size={24}/></h4>
                  <p className="text-gray-500 text-sm font-medium">سيتم تحديث كافة أكواد التتبع في المتجر بشكل حي ومباشر.</p>
                </div>
                <button 
                  onClick={() => alert("✅ تم حفظ الإعدادات بنجاح")}
                  className="bg-emerald-500 text-black px-12 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal - Re-styled for focus */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[110] p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[60px] border border-white/10 w-full max-w-5xl my-12 relative animate-in zoom-in duration-500">
              <button onClick={() => setIsEditingProduct(false)} className="absolute left-10 top-10 p-4 bg-black border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all shadow-2xl"><X size={28} /></button>
              
              <div className="mb-12">
                <h2 className="text-4xl font-black text-white flex items-center gap-5">
                  <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-500 border border-emerald-500/20"><Package size={36} /></div>
                  {currentProduct.id ? 'تعديل بيانات المنتج' : 'إدراج منتج جديد للمتجر'}
                </h2>
                <p className="text-gray-600 font-bold uppercase tracking-widest mt-2 mr-20">تأكد من اختيار أفضل الصور والوصف لجذب الزبائن</p>
              </div>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">اسم المنتج الاحترافي</label>
                    <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white outline-none focus:border-emerald-500 font-bold text-xl shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">سعر العرض (د.م)</label>
                      <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white font-black text-2xl text-emerald-500 shadow-inner" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">السعر المشطوب (د.م)</label>
                      <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white font-black text-2xl text-gray-700 shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">تصنيف المنتج</label>
                    <select value={currentProduct.category || Category.ELECTRONICS} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white font-bold text-lg outline-none appearance-none cursor-pointer shadow-inner">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{categoryLabels[cat as Category]}</option>)}
                    </select>
                  </div>
                   <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">وصف المنتج الكامل</label>
                    <textarea rows={5} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white font-medium resize-none text-lg shadow-inner"></textarea>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Main Image Upload Re-styled */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">صورة العرض الرئيسية</label>
                    <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                    <div 
                      onClick={() => mainImageInputRef.current?.click()}
                      className={`relative aspect-video rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${currentProduct.imageUrl ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-emerald-500/5'}`}
                    >
                      {currentProduct.imageUrl ? (
                        <>
                          <img src={currentProduct.imageUrl} className="w-full h-full object-cover rounded-[38px]" alt="Preview" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-[38px]">
                            <ImageIcon className="w-12 h-12 text-emerald-500 mb-2" />
                            <p className="text-white font-black">تغيير الصورة</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-600 group-hover:text-emerald-500 transition-colors">
                            <Upload size={32} />
                          </div>
                          <p className="text-gray-500 font-black text-lg">اضغط لرفع الصورة الأساسية</p>
                          <p className="text-gray-700 text-xs mt-2 font-bold">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Re-styled */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">ألبوم صور المنتج (المعرض)</label>
                    <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                    <div className="grid grid-cols-4 gap-4">
                      {(currentProduct.additionalImages || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute inset-0 bg-rose-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/40 bg-white/5 flex flex-col items-center justify-center text-gray-600 hover:text-emerald-500 transition-all shadow-lg"
                      >
                        <Plus size={32} />
                        <span className="text-[10px] font-black mt-1">إضافة</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 flex gap-5 mt-8">
                  <button type="submit" className="flex-1 bg-emerald-500 text-black py-7 rounded-[28px] font-black text-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95">حفظ وتفعيل المنتج</button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="px-12 py-7 bg-white/5 text-white rounded-[28px] font-black text-xl border border-white/10 hover:bg-white/10 transition-all">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal - Re-styled for premium feel */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[110] p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[60px] border border-white/10 w-full max-w-5xl my-12 relative animate-in zoom-in duration-500">
                <button onClick={() => setEditingOrder(null)} className="absolute left-10 top-10 p-4 bg-black border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all shadow-2xl"><X size={28} /></button>
                
                <div className="mb-12">
                  <h2 className="text-4xl font-black text-white flex items-center gap-5">
                    <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-500 border border-emerald-500/20"><ClipboardList size={36} /></div>
                    ملخص وتفاصيل الطلب
                  </h2>
                  <p className="text-gray-600 font-bold uppercase tracking-widest mt-2 mr-20">تاريخ الطلب: {new Date(editingOrder.date).toLocaleDateString('ar-EG')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="p-8 bg-black rounded-[40px] border border-white/5 shadow-inner">
                      <p className="text-[11px] font-black text-gray-600 uppercase mb-6 tracking-widest flex items-center gap-2">
                        <Users size={14}/> بيانات الزبون
                      </p>
                      <h4 className="text-white text-3xl font-black mb-3">{editingOrder.customer.fullName}</h4>
                      <div className="flex items-center gap-4 mb-4">
                        <p className="text-emerald-500 font-mono text-xl" dir="ltr">{editingOrder.customer.phone}</p>
                        <a href={`tel:${editingOrder.customer.phone}`} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Phone size={16}/></a>
                      </div>
                      <p className="text-gray-400 text-lg font-bold flex items-center gap-3 bg-white/5 py-3 px-5 rounded-2xl w-fit">
                        <MapPin size={20} className="text-rose-500" /> {editingOrder.customer.city}
                      </p>
                    </div>

                    <div className="p-8 bg-black rounded-[40px] border border-white/5 shadow-inner">
                      <p className="text-[11px] font-black text-gray-600 uppercase mb-6 tracking-widest flex items-center gap-2">
                        <Activity size={14}/> إدارة حالة الطلبية
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                          <button 
                            key={s} 
                            onClick={() => { updateOrderDetails({...editingOrder, status: s}); setEditingOrder({...editingOrder, status: s}); }} 
                            className={`py-4 rounded-2xl text-[11px] font-black border transition-all duration-300 ${editingOrder.status === s ? getStatusColor(s) + ' scale-[1.05] shadow-lg shadow-current/10' : 'bg-transparent text-gray-700 border-white/5 hover:border-white/20'}`}
                          >
                            {getStatusLabel(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-black rounded-[40px] border border-white/5 flex flex-col shadow-inner">
                    <p className="text-[11px] font-black text-gray-600 uppercase mb-8 tracking-widest flex items-center gap-2">
                      <ShoppingCart size={14}/> قائمة المنتجات المختارة
                    </p>
                    <div className="flex-1 space-y-5 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                      {editingOrder.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-colors">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-lg">{it.title}</span>
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">الكمية المطلوبة: {it.quantity}</span>
                          </div>
                          <span className="text-emerald-500 font-black text-xl">{it.price * it.quantity} <span className="text-[10px]">د.م</span></span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest mb-1">المبلغ الإجمالي للدفع</span>
                        <span className="text-4xl font-black text-emerald-500">{editingOrder.total} <span className="text-lg">د.م</span></span>
                      </div>
                      <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-emerald-500/10">
                        <Truck size={18}/> شحن مجاني
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
