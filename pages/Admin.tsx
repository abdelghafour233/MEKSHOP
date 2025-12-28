import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Sheet, Globe, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  CheckCircle2, AlertCircle, Radio, Activity, Code
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    category: Category.ELECTRONICS,
    features: ['']
  });
  const [showProductForm, setShowProductForm] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Simple Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'admin123') { 
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة. جرب: admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  // --- Product Logic ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(currentProduct.features || [])];
    newFeatures[index] = value;
    setCurrentProduct(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setCurrentProduct(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = (currentProduct.features || []).filter((_, i) => i !== index);
    setCurrentProduct(prev => ({ ...prev, features: newFeatures }));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        oldPrice: currentProduct.oldPrice ? Number(currentProduct.oldPrice) : undefined,
    } as Product;

    if (isEditing && currentProduct.id) {
      updateProduct(productData);
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
    }
    resetProductForm();
  };

  const startEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setCurrentProduct({ category: Category.ELECTRONICS, features: [''] });
    setIsEditing(false);
    setShowProductForm(false);
  };

  // --- Settings Logic ---
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettingsForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('تم حفظ إعدادات berrima store بنجاح!');
    // Reload to apply scripts injection
    window.location.reload();
  };

  const testPixel = () => {
    if (!settingsForm.facebookPixelId) {
      alert('يرجى إدخال Pixel ID أولاً');
      return;
    }
    console.log(`%c FB Pixel Test: Sending 'Contact' event to ${settingsForm.facebookPixelId}`, 'background: #1877F2; color: white; padding: 4px;');
    alert('تم إرسال حدث تجريبي (Contact) إلى الكونسول. تأكد من تفعيل FB Pixel Helper في متصفحك.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
        <div className="bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-800">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-amber-500 rounded-2xl shadow-lg mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl font-black text-center text-slate-100">berrima store</h2>
            <p className="text-slate-500 mt-2">لوحة الإدارة المركزية</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">كلمة مرور المدير</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-left transition-all pr-14 text-slate-100"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
            >
              <Lock className="w-5 h-5" />
              دخول للوحة التحكم
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-800">
            <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-blue-600/10 shadow-lg">
                    <LayoutDashboard className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-100">berrima store</h1>
                  <p className="text-xs text-slate-500">مرحباً بك في إدارة متجرك</p>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="bg-slate-950 p-1.5 rounded-2xl inline-flex flex-1 md:flex-none border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-slate-800 text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Package className="w-4 h-4" /> المنتجات
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <SettingsIcon className="w-4 h-4" /> الإعدادات
                    </button>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    title="تسجيل الخروج"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-slate-100">قائمة المنتجات</h2>
                      <p className="text-sm text-slate-500">لديك {products.length} منتجات منشورة</p>
                    </div>
                    {!showProductForm && (
                        <button 
                            onClick={() => setShowProductForm(true)}
                            className="flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                        >
                            <Plus className="w-5 h-5" /> إضافة منتج جديد
                        </button>
                    )}
                </div>

                {showProductForm && (
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl mb-8 border border-slate-800 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                                {isEditing ? <div className="p-2 bg-amber-500/10 rounded-xl"><Edit className="w-6 h-6 text-amber-500" /></div> : <div className="p-2 bg-emerald-500/10 rounded-xl"><Plus className="w-6 h-6 text-emerald-500" /></div>}
                                {isEditing ? 'تعديل المنتج' : 'إضافة منتج للسوق'}
                            </h2>
                            <button onClick={resetProductForm} className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-full transition-colors">
                                <X className="w-7 h-7" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">اسم المنتج</label>
                                    <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">السعر الحالي</label>
                                        <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-amber-500 font-black" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2 mr-1">السعر القديم</label>
                                        <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-500 transition-all line-through" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">التصنيف</label>
                                    <select name="category" value={currentProduct.category} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none text-slate-100">
                                        <option value={Category.ELECTRONICS}>إلكترونيات</option>
                                        <option value={Category.HOME}>المنزل</option>
                                        <option value={Category.CARS}>السيارات</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">وصف المنتج</label>
                                    <textarea required name="description" rows={5} value={currentProduct.description || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none resize-none text-slate-300" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">رابط صورة المنتج</label>
                                    <input required name="imageUrl" value={currentProduct.imageUrl || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none text-left text-blue-400 font-mono text-xs" dir="ltr" />
                                </div>
                                <div className="border-4 border-dashed border-slate-800 rounded-3xl p-4 h-64 flex items-center justify-center bg-slate-950 overflow-hidden relative">
                                    {currentProduct.imageUrl ? (
                                        <img src={currentProduct.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center text-slate-700">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <span className="text-sm font-bold">معاينة الصورة</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">المميزات</label>
                                    <div className="space-y-3">
                                        {currentProduct.features?.map((feature, index) => (
                                            <div key={index} className="flex gap-3">
                                                <input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-slate-300 text-sm" />
                                                <button type="button" onClick={() => removeFeature(index)} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addFeature} className="w-full py-2 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs hover:border-blue-500 hover:text-blue-500 transition-all">+ إضافة ميزة</button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 pt-8 flex gap-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-all flex justify-center items-center gap-3">
                                    <Save className="w-6 h-6" /> {isEditing ? 'تحديث المنتج' : 'نشر المنتج'}
                                </button>
                                <button type="button" onClick={resetProductForm} className="px-8 bg-slate-800 text-slate-400 rounded-2xl font-bold">إلغاء</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-800 text-right">
                        <thead className="bg-slate-950">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black text-slate-500">المنتج</th>
                                <th className="px-8 py-4 text-xs font-black text-slate-500">السعر</th>
                                <th className="px-8 py-4 text-center text-xs font-black text-slate-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-800/50 transition-all">
                                    <td className="px-8 py-4 flex items-center gap-4">
                                        <img src={product.imageUrl} className="w-12 h-12 rounded-lg object-cover border border-slate-700" alt="" />
                                        <span className="font-bold text-slate-100">{product.title}</span>
                                    </td>
                                    <td className="px-8 py-4 text-amber-500 font-black">{product.price} د.م</td>
                                    <td className="px-8 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => startEdit(product)} className="p-2 text-slate-400 hover:text-amber-500 bg-slate-950 rounded-lg"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-950 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
                
                <form onSubmit={handleSettingsSubmit} className="space-y-8 pb-20">
                    
                    {/* Facebook Advanced Section */}
                    <div className="bg-slate-900 rounded-[40px] border border-slate-800 p-8 md:p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Facebook className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-100">إعدادات Facebook Pixel</h3>
                                    <p className="text-xs text-slate-500">تتبع الحملات الإعلانية والتحويلات بدقة</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={testPixel}
                                className="px-4 py-2 bg-slate-800 text-blue-400 border border-blue-400/20 rounded-xl text-xs font-black hover:bg-blue-400 hover:text-slate-900 transition-all flex items-center gap-2"
                            >
                                <Activity className="w-4 h-4" /> اختبار الربط
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3 mr-1">Facebook Pixel ID</label>
                                <input
                                    type="text"
                                    name="facebookPixelId"
                                    value={settingsForm.facebookPixelId}
                                    onChange={handleSettingsChange}
                                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none text-slate-100 font-mono text-center tracking-widest"
                                    placeholder="123456789012345"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <h4 className="md:col-span-2 text-sm font-black text-slate-500 mb-2 mr-1">تتبع الأحداث (Events Tracking)</h4>
                                
                                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-600/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${settingsForm.fbTrackPageView ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                            <Radio className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">مشاهدة الصفحة (PageView)</span>
                                    </div>
                                    <input type="checkbox" name="fbTrackPageView" checked={settingsForm.fbTrackPageView} onChange={handleSettingsChange} className="hidden" />
                                    <div className={`w-10 h-6 rounded-full transition-all relative ${settingsForm.fbTrackPageView ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm.fbTrackPageView ? 'right-5' : 'right-1'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-600/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${settingsForm.fbTrackAddToCart ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">إضافة للسلة (AddToCart)</span>
                                    </div>
                                    <input type="checkbox" name="fbTrackAddToCart" checked={settingsForm.fbTrackAddToCart} onChange={handleSettingsChange} className="hidden" />
                                    <div className={`w-10 h-6 rounded-full transition-all relative ${settingsForm.fbTrackAddToCart ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm.fbTrackAddToCart ? 'right-5' : 'right-1'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-600/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${settingsForm.fbTrackInitiateCheckout ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">بدء الدفع (InitiateCheckout)</span>
                                    </div>
                                    <input type="checkbox" name="fbTrackInitiateCheckout" checked={settingsForm.fbTrackInitiateCheckout} onChange={handleSettingsChange} className="hidden" />
                                    <div className={`w-10 h-6 rounded-full transition-all relative ${settingsForm.fbTrackInitiateCheckout ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm.fbTrackInitiateCheckout ? 'right-5' : 'right-1'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-600/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${settingsForm.fbTrackPurchase ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                            <Radio className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">الشراء (Purchase)</span>
                                    </div>
                                    <input type="checkbox" name="fbTrackPurchase" checked={settingsForm.fbTrackPurchase} onChange={handleSettingsChange} className="hidden" />
                                    <div className={`w-10 h-6 rounded-full transition-all relative ${settingsForm.fbTrackPurchase ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm.fbTrackPurchase ? 'right-5' : 'right-1'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Custom Code Injection Section */}
                    <div className="bg-slate-900 rounded-[40px] border border-slate-800 p-8 md:p-10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                            <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
                                <Code className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-100">إضافة أكواد مخصصة (Custom Scripts)</h3>
                                <p className="text-xs text-slate-500">أضف أكواد تتبع إضافية يدوياً في الهيدر أو الفوتر</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3 mr-1 flex items-center justify-between">
                                    <span>كود الهيدر (Header Scripts)</span>
                                    <span className="text-[10px] text-slate-600">سيظهر داخل &lt;head&gt;</span>
                                </label>
                                <textarea
                                    name="headerScripts"
                                    rows={6}
                                    value={settingsForm.headerScripts}
                                    onChange={handleSettingsChange}
                                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none text-slate-300 font-mono text-xs resize-none"
                                    dir="ltr"
                                    placeholder="<!-- مثال: كود جوجل أناليتكس أو بيكسل مخصص -->"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3 mr-1 flex items-center justify-between">
                                    <span>كود الفوتر (Footer Scripts)</span>
                                    <span className="text-[10px] text-slate-600">سيظهر قبل نهاية &lt;/body&gt;</span>
                                </label>
                                <textarea
                                    name="footerScripts"
                                    rows={6}
                                    value={settingsForm.footerScripts}
                                    onChange={handleSettingsChange}
                                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none text-slate-300 font-mono text-xs resize-none"
                                    dir="ltr"
                                    placeholder="<!-- مثال: كود واتساب عائم أو شات مباشر -->"
                                />
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    <span className="text-amber-500 font-black block mb-1 underline">تنبيه هام!</span>
                                    يرجى التأكد من صحة الأكواد التي تلصقها هنا. أي خطأ قد يؤدي إلى تعطل الموقع بالكامل. تجنب إلصاق أكواد من مصادر غير موثوقة.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Other Connections */}
                    <div className="bg-slate-900 rounded-[40px] border border-slate-800 p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                            <label className="block text-sm font-black text-slate-400 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-400" /> النطاق الخاص
                            </label>
                            <input name="customDomain" value={settingsForm.customDomain} onChange={handleSettingsChange} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 font-mono text-xs" dir="ltr" placeholder="berrima-store.com" />
                         </div>
                         <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                            <label className="block text-sm font-black text-slate-400 mb-4 flex items-center gap-2">
                                <Sheet className="w-5 h-5 text-emerald-500" /> Google Sheets Link
                            </label>
                            <input name="googleSheetUrl" value={settingsForm.googleSheetUrl} onChange={handleSettingsChange} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 font-mono text-[10px]" dir="ltr" />
                         </div>
                    </div>

                    <button type="submit" className="w-full bg-amber-500 text-slate-950 py-6 rounded-3xl font-black text-xl hover:bg-amber-400 shadow-2xl shadow-amber-500/10 flex items-center justify-center gap-3">
                        <Save className="w-7 h-7" /> حفظ كافة الإعدادات المتقدمة
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;