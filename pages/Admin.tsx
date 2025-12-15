import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, Package, Facebook, Sheet, Globe, Image as ImageIcon, Link as LinkIcon, LogOut, Eye, EyeOff } from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for visibility
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
    // Trim whitespace to prevent errors from accidental spaces
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-full">
                <Lock className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">لوحة تحكم المدير</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">يرجى تسجيل الدخول للمتابعة</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-left transition-all pr-12"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">كلمة المرور الافتراضية: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <SettingsIcon className="w-6 h-6 text-indigo-700" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة المتجر</h1>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Tabs */}
                <div className="bg-gray-100 p-1 rounded-lg inline-flex flex-1 md:flex-none">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'products' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Package className="w-4 h-4" /> المنتجات
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <SettingsIcon className="w-4 h-4" /> الإعدادات
                    </button>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="تسجيل الخروج"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-700">قائمة المنتجات ({products.length})</h2>
                    {!showProductForm && (
                        <button 
                            onClick={() => setShowProductForm(true)}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" /> إضافة منتج
                        </button>
                    )}
                </div>

                {showProductForm && (
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-indigo-100 animate-fade-in relative">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {isEditing ? <div className="p-2 bg-amber-100 rounded-full"><Edit className="w-5 h-5 text-amber-600" /></div> : <div className="p-2 bg-emerald-100 rounded-full"><Plus className="w-5 h-5 text-emerald-600" /></div>}
                                {isEditing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                            </h2>
                            <button onClick={resetProductForm} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Column */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج</label>
                                    <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="مثال: سماعة بلوتوث" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">السعر (درهم)</label>
                                        <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="299" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">السعر القديم (اختياري)</label>
                                        <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-500 transition-all" placeholder="400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الفئة</label>
                                    <div className="relative">
                                        <select name="category" value={currentProduct.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none transition-all">
                                            <option value={Category.ELECTRONICS}>إلكترونيات</option>
                                            <option value={Category.HOME}>المنزل</option>
                                            <option value={Category.CARS}>السيارات</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                                    <textarea required name="description" rows={5} value={currentProduct.description || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" placeholder="وصف تفصيلي للمنتج..." />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">رابط الصورة (URL)</label>
                                    <div className="flex gap-2">
                                        <input required name="imageUrl" value={currentProduct.imageUrl || ''} onChange={handleInputChange} className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-left transition-all" dir="ltr" placeholder="https://..." />
                                        <div className="p-3 bg-gray-100 rounded-xl"><ImageIcon className="w-6 h-6 text-gray-400"/></div>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 h-52 flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                                    {currentProduct.imageUrl ? (
                                        <img 
                                            src={currentProduct.imageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <span className="text-sm">معاينة الصورة ستظهر هنا</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">المميزات (نقاط البيع)</label>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 max-h-52 overflow-y-auto">
                                        {currentProduct.features?.map((feature, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <span className="text-gray-400 text-xs font-mono">{index + 1}</span>
                                                <input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all" placeholder={`اكتب الميزة هنا...`} />
                                                <button type="button" onClick={() => removeFeature(index)} className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addFeature} className="w-full py-2.5 text-indigo-600 text-sm font-bold border border-dashed border-indigo-300 bg-indigo-50/50 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> إضافة سطر جديد
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="md:col-span-2 pt-6 border-t border-gray-100 flex gap-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2 text-lg">
                                    <Save className="w-5 h-5" /> {isEditing ? 'حفظ التعديلات' : 'نشر المنتج'}
                                </button>
                                <button type="button" onClick={resetProductForm} className="px-8 bg-white border border-gray-300 text-gray-700 p-3.5 rounded-xl font-bold hover:bg-gray-50 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">تفاصيل المنتج</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">السعر</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">التحكم</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-indigo-50/30 transition duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 p-1">
                                                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover rounded-md" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-base">{product.title}</div>
                                                    <div className="text-xs text-indigo-600 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-800">{product.price} د.م</div>
                                            {product.oldPrice && <div className="text-xs text-gray-400 line-through">{product.oldPrice} د.م</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => startEdit(product)} className="bg-amber-50 text-amber-600 p-2.5 rounded-lg hover:bg-amber-100 border border-amber-100 transition shadow-sm" title="تعديل">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) deleteProduct(product.id); }} className="bg-rose-50 text-rose-600 p-2.5 rounded-lg hover:bg-rose-100 border border-rose-100 transition shadow-sm" title="حذف">
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
            </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 max-w-4xl mx-auto">
                <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <SettingsIcon className="w-7 h-7 text-indigo-600" /> إعدادات الربط والبيكسل
                    </h2>
                    <p className="text-gray-500 mt-1">قم بربط متجرك مع منصات الإعلانات وجداول البيانات بسهولة.</p>
                </div>
                
                <form onSubmit={handleSettingsSubmit} className="space-y-8">
                    
                    {/* Domain Section */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <Globe className="w-5 h-5 text-gray-600" /> النطاق (Domain)
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم النطاق الخاص</label>
                            <div className="flex gap-2">
                                <span className="p-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-500 font-mono text-sm flex items-center">https://</span>
                                <input
                                    type="text"
                                    name="customDomain"
                                    value={settingsForm.customDomain || ''}
                                    onChange={handleSettingsChange}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all font-sans"
                                    dir="ltr"
                                    placeholder="www.mystore.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Facebook */}
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors">
                            <label className="block text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <Facebook className="w-5 h-5" /> Facebook Pixel
                            </label>
                            <input
                                type="text"
                                name="facebookPixelId"
                                value={settingsForm.facebookPixelId}
                                onChange={handleSettingsChange}
                                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono text-sm"
                                placeholder="ID: 123456789..."
                            />
                        </div>

                        {/* Google */}
                        <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors">
                            <label className="block text-base font-bold text-orange-900 mb-3 flex items-center gap-2">
                                <Globe className="w-5 h-5" /> Google Tag / Analytics
                            </label>
                            <input
                                type="text"
                                name="googleTagId"
                                value={settingsForm.googleTagId}
                                onChange={handleSettingsChange}
                                className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white font-mono text-sm"
                                placeholder="ID: G-XXXXXXXXXX"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="bg-gray-100/50 p-6 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors">
                            <label className="block text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="font-mono text-xl leading-none font-bold">♪</span> TikTok Pixel
                            </label>
                            <input
                                type="text"
                                name="tiktokPixelId"
                                value={settingsForm.tiktokPixelId}
                                onChange={handleSettingsChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white font-mono text-sm"
                                placeholder="ID: C12345..."
                            />
                        </div>
                        
                         {/* Google Sheets */}
                        <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors">
                            <label className="block text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                <Sheet className="w-5 h-5" /> Google Sheets Webhook
                            </label>
                            <input
                                type="url"
                                name="googleSheetUrl"
                                value={settingsForm.googleSheetUrl}
                                onChange={handleSettingsChange}
                                className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-mono text-xs"
                                placeholder="https://script.google.com/..."
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2 text-lg">
                            <Save className="w-6 h-6" /> حفظ جميع الإعدادات
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