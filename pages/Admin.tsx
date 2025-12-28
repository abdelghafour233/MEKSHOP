
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
  RefreshCw, Copy, Download, UploadCloud, Laptop, Smartphone, QrCode, Scan, Camera, Maximize2
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
  const [qrSize, setQrSize] = useState(window.innerWidth < 768 ? 300 : 500);
  const [localSettings, setLocalSettings] = useState(settings);

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
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    alert("✅ تم حفظ التغييرات بنجاح!");
  };

  // تحسين تشفير البيانات لتقليل كثافة الـ QR
  const syncDataString = useMemo(() => {
    // نرسل فقط البيانات الضرورية لتقليل "الضوضاء" في الـ QR
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

  // استخدام حجم أكبر ودقة أعلى (500x500)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(syncDataString)}&bgcolor=ffffff&color=000000&margin=20`;

  const importFromText = (code: string) => {
    try {
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(code))));
      // التعامل مع الاختصارات الجديدة أو القديمة
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
            <input type={showPassword ? "text" : "password"} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="كلمة المرور" className="w-full p-6 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500" />
            <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-black text-xl shadow-2xl">دخول</button>
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
                className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black transition-all text-sm uppercase ${activeTab === tab ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Settings Tab - Pixel with Test Event */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
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

                  <button type="submit" className="w-full bg-emerald-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                    حفظ وتطبيق التغييرات
                  </button>
                </form>
          </div>
        )}

        {/* باقي التبويبات تظل كما هي في الكود الأصلي... */}

        {/* QR MODAL IMPROVED - LARGE & CLEAR */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-center justify-center p-4 animate-in fade-in zoom-in">
             <div className="bg-[#111] p-8 md:p-12 rounded-[56px] border border-white/10 max-w-2xl w-full text-center relative shadow-4xl">
                <button onClick={() => setShowQRModal(false)} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={32}/></button>
                
                <div className="mb-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">مزامنة الهاتف</h2>
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-2">امسح الكود أدناه لفتح المتجر في هاتفك</p>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">تأكد من رفع سطوع شاشة الحاسوب لتسهيل عملية المسح. هذا الرمز يحتوي على جميع منتجاتك وإعداداتك.</p>
                </div>
                
                {/* QR Container - High Visibility */}
                <div className="bg-white p-6 md:p-10 rounded-[48px] shadow-[0_0_100px_rgba(16,185,129,0.2)] inline-block mb-10 relative group">
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-[48px] blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                    <img 
                        src={qrImageUrl} 
                        className="w-[280px] h-[280px] md:w-[450px] md:h-[450px] relative z-10 transition-transform" 
                        alt="Sync QR Code"
                        style={{ imageRendering: 'pixelated' }} 
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('✅ تم نسخ كود المزامنة! افتح الهاتف والصقه هناك.'); }} className="py-5 bg-emerald-500 text-black rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl">
                        <Copy size={20}/> نسخ النص البديل
                    </button>
                    <button onClick={() => window.print()} className="py-5 bg-white/5 text-white rounded-[24px] font-black flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10">
                        <Download size={20}/> طباعة الكود
                    </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ... باقي وظائف getStatusColor و getStatusLabel ...

export default Admin;
