
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
    alert("✅ تم تغيير كلمة السر بنجاح.");
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
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">نظام إدارة التجارة</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور"
                className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-gray-700 shadow-inner"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-500 transition-colors p-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                دخول للنظام
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6">
                <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl md:rounded-3xl shadow-xl shadow-emerald-500/20">
                    <ShoppingBag className="w-7 h-7 md:w-9 md:h-9 text-black" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">لوحة الإدارة</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Berrima Store Professional</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Link to="/" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-4 rounded-2xl border border-white/5 font-black hover:bg-emerald-500 hover:text-black transition-all group shadow-lg text-sm">
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">معاينة المتجر</span>
                </Link>
                <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all shadow-lg text-sm">
                    <LogOut className="w-4 h-4" /> خروج
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
           {[
             { label: 'المبيعات', value: `${dashboardStats.totalRevenue} د.م`, icon: <TrendingUp size={24}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'جديدة', value: dashboardStats.pendingCount, icon: <Activity size={24}/>, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'الطلبات', value: dashboardStats.totalOrders, icon: <ClipboardList size={24}/>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: 'المنتجات', value: dashboardStats.productCount, icon: <Package size={24}/>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
           ].map((stat, i) => (
             <div key={i} className="bg-[#0a0a0a] p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-3">
                 <div className={`p-3 md:p-4 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl mb-3 sm:mb-0`}>{stat.icon}</div>
                 <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
               </div>
               <h3 className="text-xl md:text-3xl font-black text-white">{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-2xl md:rounded-[32px] border border-white/5 mb-8 flex overflow-x-auto gap-2 shadow-2xl scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-xl md:rounded-[24px] font-black transition-all text-sm md:text-base ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Content Area */}
        {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="relative">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                      type="text" 
                      placeholder="ابحث عن زبون..." 
                      value={orderSearch} 
                      onChange={(e) => setOrderSearch(e.target.value)} 
                      className="w-full pr-14 pl-6 py-5 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold shadow-inner" 
                    />
                </div>
                <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden shadow-3xl overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-black/50 text-gray-500 text-[10px] font-black uppercase border-b border-white/5">
                            <tr>
                                <th className="p-6">المعرف</th>
                                <th className="p-6">الزبون</th>
                                <th className="p-6">القيمة</th>
                                <th className="p-6">الحالة</th>
                                <th className="p-6 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6 text-white font-black opacity-60">#{order.id.split('-')[1]}</td>
                                    <td className="p-6">
                                        <div className="font-black text-white">{order.customer.fullName}</div>
                                        <div className="text-emerald-500 text-xs mt-1 font-mono">{order.customer.phone}</div>
                                    </td>
                                    <td className="p-6 text-white font-black text-lg">{order.total} د.م</td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase inline-flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center gap-2">
                                          <button onClick={() => setEditingOrder(order)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all"><Eye size={18} /></button>
                                          <button onClick={() => { if(confirm('حذف؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-gray-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl"><Trash2 size={18} /></button>
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
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 shadow-2xl gap-4">
                <div className="text-center sm:text-right">
                    <h2 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-3">
                        <Package className="text-emerald-500" size={24} /> المنتجات ({products.length})
                    </h2>
                </div>
                <button 
                  onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }}
                  className="w-full sm:w-auto bg-emerald-500 text-black px-8 py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Plus size={20} /> إضافة منتج جديد
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden group shadow-2xl">
                  <div className="aspect-[4/3] relative overflow-hidden bg-black">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute top-4 right-4">
                        <span className="bg-black/60 backdrop-blur-md text-emerald-500 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                            {categoryLabels[product.category as Category] || product.category}
                        </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-black text-lg mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-black text-xl">{product.price} <span className="text-xs">د.م</span></span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-2.5 bg-white/5 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Edit size={16} /></button>
                        <button onClick={() => { if(confirm('حذف؟')) deleteProduct(product.id) }} className="p-2.5 bg-white/5 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Modal - RE-DESIGNED FOR MOBILE */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[110] p-0 sm:p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-6 md:p-14 rounded-none sm:rounded-[40px] border-x-0 sm:border border-white/10 w-full max-w-5xl min-h-screen sm:min-h-0 relative animate-in slide-in-from-bottom sm:zoom-in duration-500">
              
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500"><Package size={24} /></div>
                  {currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج'}
                </h2>
                <button onClick={() => setIsEditingProduct(false)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  {/* PRODUCT TITLE - NOW MORE VISIBLE */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">اسم المنتج الاحترافي</label>
                    <input 
                      required 
                      value={currentProduct.title || ''} 
                      onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} 
                      className="w-full p-4 md:p-5 bg-black border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold text-lg shadow-inner" 
                      placeholder="مثال: ساعة يد فاخرة..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">السعر (د.م)</label>
                      <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-black text-xl text-emerald-500 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">السعر القديم</label>
                      <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-black text-xl text-gray-700 shadow-inner" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">التصنيف</label>
                    <select value={currentProduct.category || Category.ELECTRONICS} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-bold text-base outline-none shadow-inner">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{categoryLabels[cat as Category]}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">الوصف</label>
                    <textarea rows={4} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-medium resize-none text-base shadow-inner"></textarea>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">الصورة الرئيسية</label>
                    <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                    <div 
                      onClick={() => mainImageInputRef.current?.click()}
                      className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${currentProduct.imageUrl ? 'border-emerald-500' : 'border-white/10 hover:border-emerald-500/40 bg-white/5'}`}
                    >
                      {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} className="w-full h-full object-cover rounded-[22px]" alt="Preview" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload size={32} className="mx-auto mb-2 text-gray-600" />
                          <p className="text-gray-500 font-black text-sm">رفع صورة المنتج</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 mr-1 uppercase tracking-widest">معرض الصور</label>
                    <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                    <div className="grid grid-cols-4 gap-3">
                      {(currentProduct.additionalImages || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-gray-600 hover:text-emerald-500 transition-all"><Plus size={24} /></button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
                  <button type="submit" className="flex-1 bg-emerald-500 text-black py-5 rounded-2xl font-black text-xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">حفظ المنتج</button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="py-5 px-8 bg-white/5 text-white rounded-2xl font-black text-lg border border-white/10">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Modal - RE-DESIGNED FOR MOBILE */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[110] p-0 sm:p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-6 md:p-14 rounded-none sm:rounded-[40px] border-x-0 sm:border border-white/10 w-full max-w-5xl min-h-screen sm:min-h-0 relative animate-in slide-in-from-bottom sm:zoom-in duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                  <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500"><ClipboardList size={24} /></div>
                    تفاصيل الطلب
                  </h2>
                  <button onClick={() => setEditingOrder(null)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-10">
                  <div className="space-y-6">
                    <div className="p-6 bg-black rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-widest">بيانات الزبون</p>
                      <h4 className="text-white text-xl font-black mb-2">{editingOrder.customer.fullName}</h4>
                      <div className="flex items-center gap-3 mb-4">
                        <p className="text-emerald-500 font-mono text-lg" dir="ltr">{editingOrder.customer.phone}</p>
                        <a href={`tel:${editingOrder.customer.phone}`} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Phone size={14}/></a>
                      </div>
                      <p className="text-gray-400 text-sm font-bold flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl w-fit">
                        <MapPin size={16} className="text-rose-500" /> {editingOrder.customer.city}
                      </p>
                    </div>

                    <div className="p-6 bg-black rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-widest">تغيير الحالة</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                          <button 
                            key={s} 
                            onClick={() => { updateOrderDetails({...editingOrder, status: s}); setEditingOrder({...editingOrder, status: s}); }} 
                            className={`py-3 rounded-xl text-[10px] font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-current' : 'text-gray-700 border-white/5'}`}
                          >
                            {getStatusLabel(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-black rounded-3xl border border-white/5 flex flex-col">
                    <p className="text-[9px] font-black text-gray-600 uppercase mb-6 tracking-widest">المنتجات المختارة</p>
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                      {editingOrder.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-sm">{it.title}</span>
                            <span className="text-gray-600 text-[10px] font-bold mt-1">الكمية: {it.quantity}</span>
                          </div>
                          <span className="text-emerald-500 font-black text-base">{it.price * it.quantity} د.م</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-black text-[9px] uppercase tracking-widest mb-1">الإجمالي</span>
                        <span className="text-2xl font-black text-emerald-500">{editingOrder.total} د.م</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl font-black text-[10px] uppercase border border-emerald-500/10">
                        شحن مجاني
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
