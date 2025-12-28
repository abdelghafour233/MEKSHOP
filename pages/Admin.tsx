import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Sheet, Globe, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard
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
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('تم حفظ الإعدادات بنجاح!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 font-sans">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-amber-500 rounded-2xl shadow-lg mb-4">
                <ShoppingBag className="w-10 h-10 text-blue-900" />
            </div>
            <h2 className="text-3xl font-black text-center text-gray-900">berrima store</h2>
            <p className="text-gray-500 mt-2">لوحة الإدارة المركزية</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">كلمة مرور المدير</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-left transition-all pr-14"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">كلمة المرور الافتراضية هي: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code></p>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
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
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="bg-blue-900 p-3 rounded-2xl shadow-blue-900/10 shadow-lg">
                    <LayoutDashboard className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">berrima store</h1>
                  <p className="text-xs text-gray-500">مرحباً بك في إدارة متجرك</p>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Tabs Switcher */}
                <div className="bg-gray-100 p-1.5 rounded-2xl inline-flex flex-1 md:flex-none">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Package className="w-4 h-4" /> المنتجات
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <SettingsIcon className="w-4 h-4" /> الإعدادات
                    </button>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
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
                      <h2 className="text-xl font-black text-gray-800">قائمة المنتجات</h2>
                      <p className="text-sm text-gray-500">لديك {products.length} منتجات منشورة</p>
                    </div>
                    {!showProductForm && (
                        <button 
                            onClick={() => setShowProductForm(true)}
                            className="flex items-center gap-2 bg-amber-500 text-blue-900 px-6 py-3 rounded-2xl font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                        >
                            <Plus className="w-5 h-5" /> إضافة منتج جديد
                        </button>
                    )}
                </div>

                {showProductForm && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl mb-8 border border-blue-50 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                {isEditing ? <div className="p-2 bg-amber-100 rounded-xl"><Edit className="w-6 h-6 text-amber-600" /></div> : <div className="p-2 bg-green-100 rounded-xl"><Plus className="w-6 h-6 text-green-600" /></div>}
                                {isEditing ? 'تعديل المنتج' : 'إضافة منتج للسوق'}
                            </h2>
                            <button onClick={resetProductForm} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors">
                                <X className="w-7 h-7" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم المنتج</label>
                                    <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-900 outline-none transition-all" placeholder="مثال: سماعة بلوتوث برو" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">السعر الحالي (د.م)</label>
                                        <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="299" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 mr-1">السعر القديم (اختياري)</label>
                                        <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-400 transition-all line-through" placeholder="450" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">التصنيف</label>
                                    <div className="relative">
                                        <select name="category" value={currentProduct.category} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none transition-all cursor-pointer font-bold">
                                            <option value={Category.ELECTRONICS}>إلكترونيات</option>
                                            <option value={Category.HOME}>المنزل</option>
                                            <option value={Category.CARS}>السيارات</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">وصف المنتج</label>
                                    <textarea required name="description" rows={5} value={currentProduct.description || ''} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all" placeholder="اكتب تفاصيل المنتج بوضوح للعميل..." />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">رابط صورة المنتج (URL)</label>
                                    <div className="flex gap-3">
                                        <input required name="imageUrl" value={currentProduct.imageUrl || ''} onChange={handleInputChange} className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-left transition-all" dir="ltr" placeholder="https://unsplash.com/photo-..." />
                                        <div className="p-4 bg-gray-100 rounded-2xl flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400"/></div>
                                    </div>
                                </div>

                                {/* Live Preview */}
                                <div className="border-4 border-dashed border-gray-100 rounded-3xl p-4 h-64 flex items-center justify-center bg-gray-50/50 overflow-hidden relative group transition-all">
                                    {currentProduct.imageUrl ? (
                                        <img 
                                            src={currentProduct.imageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'; }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-300">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <span className="text-sm font-bold">معاينة الصورة المباشرة</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">مميزات المنتج (نقاط)</label>
                                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                                        {currentProduct.features?.map((feature, index) => (
                                            <div key={index} className="flex gap-3 items-center group">
                                                <span className="text-blue-900/30 text-xs font-black">{index + 1}</span>
                                                <input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder={`ميزة رقم ${index + 1}...`} />
                                                <button type="button" onClick={() => removeFeature(index)} className="text-gray-300 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addFeature} className="w-full py-3 text-blue-900 text-sm font-black border-2 border-dashed border-blue-900/10 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> إضافة ميزة أخرى
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-8 border-t border-gray-50 flex flex-col md:flex-row gap-4">
                                <button type="submit" className="flex-1 bg-blue-900 text-white py-5 rounded-2xl font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3 text-lg">
                                    <Save className="w-6 h-6" /> {isEditing ? 'تحديث بيانات المنتج' : 'نشر المنتج في المتجر'}
                                </button>
                                <button type="button" onClick={resetProductForm} className="px-10 bg-gray-100 text-gray-500 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء الأمر</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">المنتج المعروض</th>
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">السعر</th>
                                    <th className="px-8 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {products.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold">لا يوجد منتجات حالياً. ابدأ بإضافة أول منتج!</td>
                                  </tr>
                                ) : products.map((product) => (
                                    <tr key={product.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="h-20 w-20 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                                                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-lg mb-1">{product.title}</div>
                                                    <div className="text-[10px] text-blue-900 font-black bg-blue-50 inline-block px-3 py-1 rounded-full uppercase tracking-tighter">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-lg font-black text-amber-600">{product.price} د.م</div>
                                            {product.oldPrice && <div className="text-xs text-gray-300 line-through font-bold">{product.oldPrice} د.م</div>}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => startEdit(product)} className="bg-white text-blue-900 p-3 rounded-xl hover:bg-blue-900 hover:text-white border border-gray-100 transition-all shadow-sm" title="تعديل">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من berrima store؟')) deleteProduct(product.id); }} className="bg-white text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white border border-gray-100 transition-all shadow-sm" title="حذف">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
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

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                <div className="mb-10 border-b border-gray-50 pb-8 text-center">
                    <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <SettingsIcon className="w-10 h-10 text-blue-900" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">إعدادات المتجر المتقدمة</h2>
                    <p className="text-gray-500">تحكم في التتبع، الربط، وهوية berrima store الرقمية</p>
                </div>
                
                <form onSubmit={handleSettingsSubmit} className="space-y-10">
                    
                    {/* Domain Section */}
                    <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-50/50">
                        <h3 className="text-lg font-black text-blue-900 mb-5 flex items-center gap-3">
                             <Globe className="w-6 h-6" /> النطاق الخاص (Custom Domain)
                        </h3>
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-600 mr-1">اربط متجرك بنطاقك الخاص لزيادة الموثوقية</label>
                            <div className="flex gap-3">
                                <span className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 font-mono text-sm flex items-center shadow-sm">https://</span>
                                <input
                                    type="text"
                                    name="customDomain"
                                    value={settingsForm.customDomain || ''}
                                    onChange={handleSettingsChange}
                                    className="flex-1 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-blue-900 font-bold shadow-sm"
                                    dir="ltr"
                                    placeholder="berrima-store.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Facebook */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-400 transition-all shadow-sm">
                            <label className="block text-sm font-black text-blue-800 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg"><Facebook className="w-5 h-5" /></div> Facebook Pixel ID
                            </label>
                            <input
                                type="text"
                                name="facebookPixelId"
                                value={settingsForm.facebookPixelId}
                                onChange={handleSettingsChange}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-mono text-sm font-bold text-center"
                                placeholder="معرف البيكسل..."
                            />
                        </div>

                        {/* Google */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-orange-400 transition-all shadow-sm">
                            <label className="block text-sm font-black text-orange-800 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg"><Globe className="w-5 h-5" /></div> Google Tag (G-ID)
                            </label>
                            <input
                                type="text"
                                name="googleTagId"
                                value={settingsForm.googleTagId}
                                onChange={handleSettingsChange}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none font-mono text-sm font-bold text-center"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-black transition-all shadow-sm">
                            <label className="block text-sm font-black text-gray-900 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg"><span className="font-mono text-xl leading-none font-black">♪</span></div> TikTok Pixel ID
                            </label>
                            <input
                                type="text"
                                name="tiktokPixelId"
                                value={settingsForm.tiktokPixelId}
                                onChange={handleSettingsChange}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-black/10 outline-none font-mono text-sm font-bold text-center"
                                placeholder="معرف تيك توك..."
                            />
                        </div>
                        
                         {/* Google Sheets */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-emerald-400 transition-all shadow-sm">
                            <label className="block text-sm font-black text-emerald-800 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg"><Sheet className="w-5 h-5" /></div> Google Sheets Hook
                            </label>
                            <input
                                type="url"
                                name="googleSheetUrl"
                                value={settingsForm.googleSheetUrl}
                                onChange={handleSettingsChange}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-mono text-[10px] text-center"
                                placeholder="رابط سكربت جوجل شيتس..."
                            />
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-50">
                        <button type="submit" className="w-full bg-amber-500 text-blue-900 py-6 rounded-3xl font-black hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 flex justify-center items-center gap-3 text-xl">
                            <Save className="w-7 h-7" /> حفظ جميع الإعدادات فوراً
                        </button>
                    </div>
                </form>
            </div>
        )}

      </div>
    </div>
  );
};

export default Admin;