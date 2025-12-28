
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  RefreshCw, Copy, Download, UploadCloud, Laptop, Smartphone, QrCode, Scan, Camera, Maximize2,
  KeyRound, Megaphone
} from 'lucide-react';

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

  // Sync States
  const [showQRModal, setShowQRModal] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Password Update State
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, activeTab]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);

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
    
    // التحقق من تغيير كلمة السر
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
    alert("✅ تم حفظ جميع الإعدادات وتحديث المتجر بنجاح!");
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

  const importFromText = (code: string) => {
    try {
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(code))));
      const productsData = decodedData.p || decodedData.products;
      const settingsData = decodedData.s || decodedData.settings;
      
      if (productsData) {
        localStorage.setItem('souqMaghrebProducts', JSON.stringify(productsData));
        localStorage.setItem('souqMaghrebSettings', JSON.stringify(settingsData));
        alert("✅ تمت المزامنة بنجاح!");
        window.location.reload();
      }
    } catch (e) {
      alert("❌ كود المزامنة غير صالح.");
    }
  };

  const dashboardStats = useMemo(() => {
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      totalRevenue,
      pendingCount: orders.filter(o => o.status === 'Pending').length,
      totalOrders: orders.length,
      productCount: products.length
    };
  }, [orders, products]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-2xl">
            <Lock className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">نظام الإدارة</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور" 
                className="w-full p-6 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500 font-mono placeholder:text-gray-800 shadow-inner" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-emerald-500 p-2 transition-colors"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-transform">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-12 pb-24">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-5 z-10">
                <div className="p-5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <LayoutDashboard className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">غرفة التحكم</h1>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-70">Berrima Command Center</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto z-10">
                <button onClick={() => setShowQRModal(true)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-500 px-6 py-4 rounded-2xl border border-emerald-500/20 font-black flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all">
                    <QrCode size={18} /> مزامنة واضحة (QR)
                </button>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut size={18} /> خروج
                </button>
            </div>
        </div>

        {/* Tabs Control */}
        <div className="bg-[#0a0a0a] p-2 rounded-[28px] border border-white/5 mb-10 flex gap-2 overflow-x-auto scrollbar-hide shadow-inner">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black transition-all text-sm uppercase ${activeTab === tab ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/20 scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'orders' ? <ShoppingCart size={18}/> : tab === 'products' ? <Package size={18}/> : <SettingsIcon size={18}/>}
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
                {/* Sync Section */}
                <div className="bg-[#0a0a0a] p-10 rounded-[48px] border-2 border-emerald-500/20 shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4"><Smartphone className="text-emerald-500"/> ربط الهاتف (مزامنة فورية)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4">
                            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest text-right">خيار 1: مسح الكود</p>
                            <button onClick={() => setShowQRModal(true)} className="w-full py-5 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-black transition-all">
                                <Maximize2 size={20}/> فتح الـ QR الكبير
                            </button>
                        </div>
                        <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4">
                            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest text-right">خيار 2: لصق كود</p>
                            <button onClick={() => { const code = prompt('إلصق كود المزامنة هنا:'); if(code) importFromText(code); }} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                <ClipboardList size={20}/> لصق النص يدوياً
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-10">
                  {/* Facebook Pixel Section */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl"><Facebook size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">إعدادات فيسبوك</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">مدير أحداث فيسبوك وتتبع المبيعات</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Pixel ID</label>
                            <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-blue-500 transition-all" placeholder="123456789" />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Test Event Code</label>
                            <input type="text" value={localSettings.fbTestEventCode || ''} onChange={(e) => setLocalSettings({...localSettings, fbTestEventCode: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-emerald-500 font-mono text-base outline-none focus:border-blue-500 transition-all" placeholder="TEST12345" />
                        </div>
                    </div>
                  </div>

                  {/* Google AdSense Section */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl"><Megaphone size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">جوجل أدسينس (Ads)</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">تفعيل الإعلانات على متجرك</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">معرف الناشر (Publisher ID)</label>
                        <input type="text" value={localSettings.googleAdsenseId || ''} onChange={(e) => setLocalSettings({...localSettings, googleAdsenseId: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-amber-500 transition-all" placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                        <p className="text-[10px] text-gray-600 font-bold">سيتم حقن كود أدسينس تلقائياً في جميع صفحات المتجر.</p>
                    </div>
                  </div>

                  {/* Security / Password Section */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-rose-600"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-rose-600/10 text-rose-500 rounded-2xl"><KeyRound size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">الأمان وتغيير كلمة السر</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">تحديث بيانات الدخول للوحة التحكم</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">كلمة السر الجديدة</label>
                            <div className="relative">
                                <input 
                                    type={showNewPass ? "text" : "password"} 
                                    value={passwords.new} 
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                                    className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-rose-500 transition-all shadow-inner" 
                                    placeholder="اتركها فارغة إذا لم ترد التغيير" 
                                />
                                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                    {showNewPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">تأكيد كلمة السر</label>
                            <input 
                                type={showNewPass ? "text" : "password"} 
                                value={passwords.confirm} 
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                                className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-mono text-base outline-none focus:border-rose-500 transition-all shadow-inner" 
                                placeholder="أعد الكتابة للتأكيد" 
                            />
                        </div>
                    </div>
                  </div>

                  {/* Google Sheet Section */}
                  <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600"></div>
                    <div className="flex items-center gap-5 mb-10">
                      <div className="p-4 bg-emerald-600/10 text-emerald-500 rounded-2xl"><Database size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-white">جوجل شيت</h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">تزامن الطلبات تلقائياً</p>
                      </div>
                    </div>
                    <input type="url" value={localSettings.googleSheetUrl || ''} onChange={(e) => setLocalSettings({...localSettings, googleSheetUrl: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-emerald-500 shadow-inner" placeholder="https://script.google.com/macros/s/..." />
                  </div>

                  <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4">
                    <Save size={32} /> حفظ وتطبيق جميع التغييرات
                  </button>
                </form>
          </div>
        )}

        {/* Orders Tab Content */}
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
                                  <th className="p-6">الزبون</th>
                                  <th className="p-6">المدينة</th>
                                  <th className="p-6">القيمة</th>
                                  <th className="p-6">الحالة</th>
                                  <th className="p-6 text-center">الإجراءات</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {orders.filter(o => o.customer.fullName.includes(orderSearch) || o.customer.phone.includes(orderSearch)).map(order => (
                                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
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
                                            <button onClick={() => setEditingOrder(order)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all"><Edit size={18} /></button>
                                            <button onClick={() => { if(confirm('حذف الطلب؟')) deleteOrder(order.id) }} className="p-3 bg-white/5 text-rose-500 hover:bg-rose-500 transition-all rounded-xl"><Trash2 size={18} /></button>
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

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <button onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all">
              <Plus size={24} /> إضافة منتج جديد
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl group">
                  <div className="aspect-[4/3] bg-black relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-black text-base mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-500 font-black text-xl">{product.price} د.م</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-3 bg-white/5 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all"><Edit size={16} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-3 bg-white/5 text-rose-500 rounded-xl hover:bg-rose-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Sync Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-4 animate-in fade-in zoom-in">
             <div className="bg-[#111] p-8 md:p-12 rounded-[56px] border border-white/10 max-w-2xl w-full text-center relative shadow-4xl">
                <button onClick={() => setShowQRModal(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={32}/></button>
                <div className="mb-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">مزامنة الهاتف</h2>
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-2">امسح الكود أدناه لفتح المتجر في هاتفك</p>
                </div>
                <div className="bg-white p-6 md:p-10 rounded-[48px] shadow-[0_0_100px_rgba(16,185,129,0.2)] inline-block mb-10 relative group">
                    <img src={qrImageUrl} className="w-[280px] h-[280px] md:w-[450px] md:h-[450px] relative z-10" alt="Sync QR Code" style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ كود المزامنة!'); }} className="py-5 bg-emerald-500 text-black rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl">
                        <Copy size={20}/> نسخ النص البديل
                    </button>
                    <button onClick={() => window.print()} className="py-5 bg-white/5 text-white rounded-[24px] font-black flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10">
                        <Download size={20}/> طباعة الكود
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* Editing Order Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col overflow-hidden animate-in fade-in zoom-in">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]">
              <h2 className="text-2xl font-black text-white">تفاصيل الطلب</h2>
              <button onClick={() => setEditingOrder(null)} className="p-3 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-black">
                <form onSubmit={(e) => { e.preventDefault(); updateOrderDetails(editingOrder); setEditingOrder(null); }} className="max-w-4xl mx-auto space-y-10">
                   <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 space-y-6">
                        <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">اسم الزبون</label>
                        <input type="text" value={editingOrder.customer.fullName} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white font-black" />
                   </div>
                   <button type="submit" className="w-full py-6 bg-emerald-500 text-black rounded-[32px] font-black text-xl shadow-2xl">حفظ التغييرات</button>
                </form>
            </div>
          </div>
        )}

        {/* Editing Product Modal */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]">
              <h2 className="text-2xl font-black text-white">{currentProduct.id ? 'تحرير المنتج' : 'إضافة منتج'}</h2>
              <button onClick={() => setIsEditingProduct(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-black">
              <form onSubmit={(e) => { e.preventDefault(); if(currentProduct.id) updateProduct(currentProduct as Product); else addProduct({...currentProduct, id: Date.now().toString()} as Product); setIsEditingProduct(false); }} className="max-w-4xl mx-auto space-y-10">
                <div className="bg-[#0a0a0a] p-8 rounded-[40px] border-2 border-emerald-500/30">
                  <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white font-black text-2xl" placeholder="اسم المنتج" />
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-2xl">حفظ المنتج</button>
              </form>
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
