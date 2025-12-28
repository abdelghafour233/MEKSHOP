
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Settings as SettingsIcon, 
  Package, LogOut, Eye, EyeOff, ShoppingBag, 
  Search, Hash, DollarSign, Clock, ClipboardList, Award, Truck, AlertCircle,
  Link as LinkIcon, Database, Facebook, Chrome, Target, MapPin, Shield
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, updateOrderDetails, deleteOrder } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders'>('orders');
  
  // States for Password Change
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // States for Product Management
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  // States for Order Search
  const [orderSearch, setOrderSearch] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.title || !currentProduct.price || !currentProduct.imageUrl) {
      alert("المرجو ملء جميع الحقول الأساسية");
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

  const stats = useMemo(() => {
    const confirmed = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');
    const totalSales = confirmed.reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    return { totalSales, pendingOrders, totalOrders: orders.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || 
        o.customer.phone.includes(orderSearch) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Shipped': return 'bg-green-500/10 text-green-600 border-green-500/20';
          case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
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
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">إدارة المتجر</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-10">منطقة محظورة</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="أدخل كلمة المرور"
                className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-green-500 transition-all font-mono placeholder:text-gray-700"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-500 transition-colors p-2"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-green-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                دخول للنظام
            </button>
          </form>
          {settings.adminPassword === 'admin123' && (
            <p className="mt-8 text-gray-700 text-[10px] font-bold uppercase tracking-widest">admin123 :كلمة السر الافتراضية</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 md:py-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/20">
                    <ShoppingBag className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">berrima store management</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 bg-green-500/10 text-green-500 px-6 py-3.5 rounded-2xl border border-green-500/20 font-black hover:bg-green-500 hover:text-black transition-all group">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" /> معاينة المتجر
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-3.5 rounded-2xl border border-red-500/20 font-black hover:bg-red-500 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" /> خروج
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-[28px] border border-white/5 mb-10 flex flex-wrap gap-2 shadow-xl">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'orders' && <ClipboardList size={18} />}
                {tab === 'products' && <Package size={18} />}
                {tab === 'settings' && <SettingsIcon size={18} />}
                {tab === 'orders' ? 'الطلبيات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Content Area */}
        {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input type="text" placeholder="ابحث عن زبون، رقم هاتف، أو رقم طلب..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-16 pl-6 py-5 bg-[#0a0a0a] border border-white/5 rounded-3xl text-white outline-none focus:border-green-500 transition-all font-bold" />
                </div>
                <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-right">
                        <thead className="bg-black/50 text-gray-500 text-[10px] font-black uppercase border-b border-white/5">
                            <tr>
                                <th className="p-6">رقم الطلب</th>
                                <th className="p-6">المعلومات</th>
                                <th className="p-6">السعر</th>
                                <th className="p-6">الحالة</th>
                                <th className="p-6 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6"><span className="text-white font-black">{order.id.split('-')[1]}</span></td>
                                    <td className="p-6">
                                        <div className="font-black text-white text-sm">{order.customer.fullName}</div>
                                        <div className="text-green-500 text-xs mt-1 font-mono">{order.customer.phone}</div>
                                    </td>
                                    <td className="p-6 text-white font-black">{order.total} د.م</td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-6 flex justify-center gap-2">
                                        <button onClick={() => setEditingOrder(order)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-green-500 hover:text-black transition-all"><Eye size={18} /></button>
                                        <button onClick={() => deleteOrder(order.id)} className="p-3 bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all rounded-xl"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <Package className="text-green-500" /> قائمة المنتجات ({products.length})
                </h2>
                <button 
                  onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }}
                  className="bg-green-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-green-400 transition-all shadow-lg shadow-green-500/10"
                >
                  <Plus size={20} /> إضافة منتج
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-black/80 backdrop-blur text-white rounded-xl hover:bg-green-500 hover:text-black transition-all"><Edit size={16} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-3 bg-black/80 backdrop-blur text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-black text-lg line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-green-500 font-black text-xl">{product.price} د.م</span>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            
            {/* Tracking Settings */}
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
              <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                <Target className="text-green-500" size={32} /> إعدادات التتبع والربط
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Facebook size={14} className="text-blue-500" /> Facebook Pixel ID
                  </label>
                  <input 
                    type="text" 
                    value={settings.facebookPixelId} 
                    onChange={(e) => updateSettings({...settings, facebookPixelId: e.target.value})}
                    placeholder="مثال: 1234567890"
                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Award size={14} className="text-yellow-500" /> FB Test Event Code
                  </label>
                  <input 
                    type="text" 
                    value={settings.fbTestEventCode} 
                    onChange={(e) => updateSettings({...settings, fbTestEventCode: e.target.value})}
                    placeholder="TEST12345"
                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} className="text-green-500" /> Google Sheet URL (Webhook)
                  </label>
                  <input 
                    type="text" 
                    value={settings.googleSheetUrl} 
                    onChange={(e) => updateSettings({...settings, googleSheetUrl: e.target.value})}
                    placeholder="https://script.google.com/..."
                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Chrome size={14} className="text-blue-400" /> Google Tag ID
                  </label>
                  <input 
                    type="text" 
                    value={settings.googleTagId} 
                    onChange={(e) => updateSettings({...settings, googleTagId: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="bg-green-500/5 p-8 rounded-3xl border border-green-500/10 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-black mb-1">حفظ جميع الإعدادات</h4>
                  <p className="text-gray-500 text-xs">سيتم تطبيق التغييرات فوراً على جميع زوار المتجر.</p>
                </div>
                <button 
                  onClick={() => alert("✅ تم حفظ الإعدادات بنجاح")}
                  className="bg-green-500 text-black px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                >
                  حفظ الآن
                </button>
              </div>
            </div>

            {/* Security Settings (Change Password) */}
            <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
              <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                <Shield className="text-red-500" size={32} /> إعدادات الأمان
              </h2>
              
              <div className="space-y-6 max-w-md">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Lock size={14} /> كلمة سر لوحة التحكم الجديدة
                  </label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة سر قوية"
                      className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono outline-none focus:border-red-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-2"
                    >
                      {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleChangePassword}
                  className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                >
                  تحديث كلمة السر
                </button>
                <p className="text-gray-600 text-[10px] font-bold text-center uppercase tracking-widest">
                  سيتم طلب كلمة السر الجديدة في المرة القادمة التي تدخل فيها
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[110] p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-[56px] border border-white/10 w-full max-w-4xl my-8 relative animate-in zoom-in duration-300">
              <button onClick={() => setIsEditingProduct(false)} className="absolute left-8 top-8 p-3 bg-black border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X size={24} /></button>
              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><Package size={28} /></div>
                {currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">اسم المنتج</label>
                    <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white outline-none focus:border-green-500 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">السعر الحالي</label>
                      <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-black" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">السعر القديم</label>
                      <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-black text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">القسم</label>
                    <select value={currentProduct.category || Category.ELECTRONICS} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-bold outline-none appearance-none">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">رابط الصورة الرئيسية</label>
                    <input required value={currentProduct.imageUrl || ''} onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">وصف المنتج</label>
                    <textarea rows={4} value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-medium resize-none"></textarea>
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="flex-1 bg-green-500 text-black py-5 rounded-2xl font-black text-xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/10">حفظ المنتج</button>
                  <button type="button" onClick={() => setIsEditingProduct(false)} className="px-10 py-5 bg-white/5 text-white rounded-2xl font-black border border-white/5">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[110] p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-[56px] border border-white/10 w-full max-w-4xl my-8 relative animate-in zoom-in duration-300">
                <button onClick={() => setEditingOrder(null)} className="absolute left-8 top-8 p-3 bg-black border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X size={24} /></button>
                <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><ClipboardList size={28} /></div>
                  تفاصيل الطلبية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="p-6 bg-black rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">الزبون</p>
                      <h4 className="text-white text-xl font-black">{editingOrder.customer.fullName}</h4>
                      <p className="text-green-500 font-mono mt-2" dir="ltr">{editingOrder.customer.phone}</p>
                      <p className="text-gray-400 mt-2 font-bold flex items-center gap-2"><MapPin size={14} /> {editingOrder.customer.city}</p>
                    </div>
                    <div className="p-6 bg-black rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">الحالة</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                          <button key={s} onClick={() => { updateOrderDetails({...editingOrder, status: s}); setEditingOrder({...editingOrder, status: s}); }} className={`py-2 rounded-xl text-[10px] font-black border ${editingOrder.status === s ? getStatusColor(s) : 'bg-transparent text-gray-700 border-white/5'}`}>{getStatusLabel(s)}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-black rounded-3xl border border-white/5 flex flex-col">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-widest">المنتجات المختارة</p>
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                      {editingOrder.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-white font-bold text-sm">{it.title} (x{it.quantity})</span>
                          <span className="text-green-500 font-black">{it.price * it.quantity} د.م</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-gray-500 font-black text-xs uppercase tracking-widest">الإجمالي</span>
                      <span className="text-2xl font-black text-green-500">{editingOrder.total} د.م</span>
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
