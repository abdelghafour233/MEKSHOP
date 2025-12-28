
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  RefreshCw, Copy, Download, UploadCloud, Laptop, Smartphone, QrCode, Maximize2,
  KeyRound, Megaphone, ImagePlus
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
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    features: [],
    additionalImages: []
  });
  
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
          setCurrentProduct({ ...currentProduct, imageUrl: base64String });
        } else {
          const currentGallery = currentProduct.additionalImages || [];
          if (currentGallery.length >= 5) {
            alert("أقصى عدد للصور هو 5");
            return;
          }
          setCurrentProduct({ ...currentProduct, additionalImages: [...currentGallery, base64String] });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    const currentGallery = currentProduct.additionalImages || [];
    setCurrentProduct({
      ...currentProduct,
      additionalImages: currentGallery.filter((_, i) => i !== index)
    });
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
      if (decodedData.p) {
        localStorage.setItem('souqMaghrebProducts', JSON.stringify(decodedData.p));
        localStorage.setItem('souqMaghrebSettings', JSON.stringify(decodedData.s));
        alert("✅ تمت المزامنة!");
        window.location.reload();
      }
    } catch (e) {
      alert("❌ كود غير صالح");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="bg-[#0a0a0a] p-10 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center relative overflow-hidden">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
            <Lock className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6">الإدارة</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input type={showPassword ? "text" : "password"} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="كلمة المرور" className="w-full p-6 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-emerald-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-black text-xl active:scale-95 transition-transform">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-6 md:py-12 pb-24">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 bg-[#0a0a0a] p-6 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500 rounded-xl shadow-lg">
                    <LayoutDashboard className="w-6 h-6 text-black" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Berrima Store Admin</p>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setShowQRModal(true)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-500 px-5 py-3 rounded-xl border border-emerald-500/20 font-black flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all">
                    <QrCode size={18} /> مزامنة
                </button>
                <button onClick={handleLogout} className="flex-1 md:flex-none bg-rose-500/10 text-rose-500 px-5 py-3 rounded-xl border border-rose-500/20 font-black hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut size={18} /> خروج
                </button>
            </div>
        </div>

        {/* Tabs Control */}
        <div className="bg-[#0a0a0a] p-1.5 rounded-[22px] border border-white/5 mb-8 flex gap-1 overflow-x-auto scrollbar-hide">
            {(['orders', 'products', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black transition-all text-xs flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {tab === 'orders' ? 'الطلبات' : tab === 'products' ? 'المنتجات' : 'الإعدادات'}
              </button>
            ))}
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <button onClick={() => { setCurrentProduct({ features: [], additionalImages: [] }); setIsEditingProduct(true); }} className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-400 transition-all">
              <Plus size={20} /> إضافة منتج جديد
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-xl group">
                  <div className="aspect-square bg-black relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-emerald-500 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">{product.category}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-black text-sm mb-3 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-500 font-black text-base">{product.price} د.م</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }} className="p-2 bg-white/5 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Edit size={14} /></button>
                        <button onClick={() => { if(confirm('حذف المنتج؟')) deleteProduct(product.id) }} className="p-2 bg-white/5 text-rose-500 rounded-lg hover:bg-rose-500 transition-all hover:text-white"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPACT PRODUCT MODAL - FIXED */}
        {isEditingProduct && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl rounded-[32px] shadow-4xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Package size={20}/></div>
                  {currentProduct.id ? 'تعديل المنتج' : 'منتج جديد'}
                </h2>
                <button onClick={() => setIsEditingProduct(false)} className="p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
                <form id="productForm" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(!currentProduct.imageUrl) { alert("المرجو إضافة صورة رئيسية"); return; }
                  if(currentProduct.id) updateProduct(currentProduct as Product); 
                  else addProduct({...currentProduct, id: Date.now().toString()} as Product); 
                  setIsEditingProduct(false); 
                }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left: Info */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">اسم المنتج</label>
                      <input required value={currentProduct.title || ''} onChange={(e) => setCurrentProduct({...currentProduct, title: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-white font-bold outline-none focus:border-emerald-500 transition-all text-sm" placeholder="أدخل اسم المنتج..." />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">السعر (د.م)</label>
                        <input type="number" required value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-emerald-500 font-black outline-none focus:border-emerald-500 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">السعر القديم</label>
                        <input type="number" value={currentProduct.oldPrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, oldPrice: Number(e.target.value)})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-gray-600 font-black outline-none focus:border-emerald-500 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">الفئة</label>
                      <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-white font-bold outline-none focus:border-emerald-500 appearance-none text-sm">
                        {Object.values(Category).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description - FIXED Frame */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">وصف المنتج</label>
                      <div className="border border-white/5 rounded-xl bg-black overflow-hidden focus-within:border-emerald-500 transition-all h-40">
                        <textarea 
                          required
                          value={currentProduct.description || ''} 
                          onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} 
                          className="w-full h-full p-4 bg-transparent text-gray-300 text-sm leading-relaxed outline-none resize-none overflow-y-auto" 
                          placeholder="تفاصيل المنتج ومميزاته..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Right: Images */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">الصورة الرئيسية</label>
                      <div 
                        onClick={() => mainImageInputRef.current?.click()}
                        className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                          ${currentProduct.imageUrl ? 'border-emerald-500/20' : 'border-white/5 hover:border-emerald-500/40 bg-black'}`}
                      >
                        {currentProduct.imageUrl ? (
                          <img src={currentProduct.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <UploadCloud size={24} className="text-emerald-500 mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-gray-500 font-black">اضغط للرفع</p>
                          </div>
                        )}
                        <input type="file" ref={mainImageInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" accept="image/*" />
                      </div>
                    </div>

                    {/* Small Gallery Sync */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">المعرض</label>
                        <span className="text-[10px] text-emerald-500 font-black">{(currentProduct.additionalImages || []).length}/5</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 bg-black/50 p-2 rounded-xl border border-white/5">
                        {(currentProduct.additionalImages || []).map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group border border-white/5">
                            <img src={img} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"><Trash2 size={12}/></button>
                          </div>
                        ))}
                        {(currentProduct.additionalImages || []).length < 5 && (
                          <button type="button" onClick={() => galleryImageInputRef.current?.click()} className="aspect-square rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all bg-black"><Plus size={16} /></button>
                        )}
                      </div>
                      <input type="file" ref={galleryImageInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-black/20">
                <button type="submit" form="productForm" className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black text-lg shadow-xl shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> {currentProduct.id ? 'حفظ التعديلات' : 'نشر المنتج'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input type="text" placeholder="ابحث عن زبون..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-12 pl-4 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white outline-none focus:border-emerald-500 font-bold text-sm" />
            </div>
            <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-x-auto">
              <table className="w-full text-right min-w-[700px]">
                <thead className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="p-4">الزبون</th>
                    <th className="p-4">المدينة</th>
                    <th className="p-4">القيمة</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.filter(o => o.customer.fullName.includes(orderSearch)).map(order => (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-black text-white text-sm">{order.customer.fullName}<div className="text-[10px] text-gray-500 font-mono mt-0.5">{order.customer.phone}</div></td>
                      <td className="p-4 text-gray-400 text-sm">{order.customer.city}</td>
                      <td className="p-4 text-emerald-500 font-black text-base">{order.total} د.م</td>
                      <td className="p-4 text-[10px] font-black">{order.status}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { if(confirm('حذف الطلب؟')) deleteOrder(order.id) }} className="p-2 bg-white/5 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 space-y-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3"><SettingsIcon className="text-emerald-500"/> إعدادات المتجر</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Facebook Pixel ID</label>
                    <input type="text" value={localSettings.facebookPixelId || ''} onChange={(e) => setLocalSettings({...localSettings, facebookPixelId: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-white font-mono text-sm outline-none" placeholder="123456789" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Google AdSense ID</label>
                    <input type="text" value={localSettings.googleAdsenseId || ''} onChange={(e) => setLocalSettings({...localSettings, googleAdsenseId: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-white font-mono text-sm outline-none" placeholder="ca-pub-..." />
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">تغيير كلمة مرور الإدارة</label>
                  <input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full p-4 bg-black border border-white/5 rounded-xl text-white font-mono text-sm outline-none" placeholder="كلمة سر جديدة..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">حفظ الإعدادات</button>
            </form>
          </div>
        )}

        {/* QR Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[600] flex items-center justify-center p-4">
             <div className="bg-[#111] p-10 rounded-[40px] border border-white/10 max-w-lg w-full text-center relative">
                <button onClick={() => setShowQRModal(false)} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"><X size={28}/></button>
                <h2 className="text-2xl font-black text-white mb-8">مزامنة البيانات</h2>
                <div className="bg-white p-6 rounded-3xl mb-8 inline-block shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <img src={qrImageUrl} className="w-[300px] h-[300px]" alt="Sync QR" />
                </div>
                <button onClick={() => { navigator.clipboard.writeText(syncDataString); alert('تم النسخ!'); }} className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black flex items-center justify-center gap-2">
                    <Copy size={20}/> نسخ كود المزامنة
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
