import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Sheet, Globe, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  CheckCircle2, AlertCircle, Radio, Activity, Code, Search, Filter
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  // Product List State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

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
      alert('تم تحديث المنتج والأسعار بنجاح');
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
      alert('تمت إضافة المنتج الجديد بنجاح');
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

  const handleDelete = (id: string) => {
      deleteProduct(id);
      setDeleteConfirmId(null);
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
    window.location.reload();
  };

  const testPixel = () => {
    if (!settingsForm.facebookPixelId) {
      alert('يرجى إدخال Pixel ID أولاً');
      return;
    }
    console.log(`%c FB Pixel Test: Sending 'Contact' event to ${settingsForm.facebookPixelId}`, 'background: #1877F2; color: white; padding: 4px;');
    alert('تم إرسال حدث تجريبي (Contact) إلى الكونسول.');
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
                  <h1 className="text-2xl font-black text-slate-100">لوحة التحكم</h1>
                  <p className="text-xs text-slate-500">إدارة المنتجات والإعدادات</p>
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
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500" />
                        <input 
                            type="text" 
                            placeholder="ابحث عن منتج..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-12 pl-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-900 text-slate-300 px-4 py-3.5 border border-slate-800 rounded-2xl outline-none focus:border-amber-500"
                        >
                            <option value="all">جميع التصنيفات</option>
                            <option value={Category.ELECTRONICS}>إلكترونيات</option>
                            <option value={Category.HOME}>المنزل</option>
                            <option value={Category.CARS}>السيارات</option>
                        </select>
                        <button 
                            onClick={() => setShowProductForm(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500 text-slate-900 px-6 py-3.5 rounded-2xl font-black hover:bg-amber-400 transition-all shadow-lg"
                        >
                            <Plus className="w-5 h-5" /> منتج جديد
                        </button>
                    </div>
                </div>

                {showProductForm && (
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                                {isEditing ? <Edit className="w-6 h-6 text-amber-500" /> : <Plus className="w-6 h-6 text-emerald-500" />}
                                {isEditing ? 'تعديل بيانات المنتج والأسعار' : 'إضافة منتج جديد للكتالوج'}
                            </h2>
                            <button onClick={resetProductForm} className="text-slate-500 hover:text-red-500 p-2 transition-colors">
                                <X className="w-7 h-7" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 mr-1">اسم المنتج</label>
                                    <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none text-slate-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-950 rounded-2xl border border-slate-800">
                                    <div className="md:col-span-2 text-xs font-black text-amber-500 mb-2">إدارة الأسعار (د.م)</div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">السعر الحالي</label>
                                        <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl outline-none text-amber-500 font-black text-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">السعر قبل التخفيض</label>
                                        <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl outline-none text-slate-500 line-through" />
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
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-all flex justify-center items-center gap-3 shadow-xl">
                                    <Save className="w-6 h-6" /> {isEditing ? 'تحديث وحفظ التغييرات' : 'نشر المنتج الآن'}
                                </button>
                                <button type="button" onClick={resetProductForm} className="px-8 bg-slate-800 text-slate-400 rounded-2xl font-bold">إلغاء</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-right">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-black text-slate-500">المنتج</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-500">التصنيف</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-500">السعر</th>
                                    <th className="px-8 py-4 text-center text-xs font-black text-slate-500">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-800/50 transition-all group">
                                        <td className="px-8 py-4 flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                                                <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <span className="font-bold text-slate-100 line-clamp-1">{product.title}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs bg-slate-950 text-slate-400 px-3 py-1 rounded-lg border border-slate-800">{product.category}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-amber-500 font-black">{product.price} د.م</span>
                                                {product.oldPrice && <span className="text-[10px] text-slate-600 line-through">{product.oldPrice} د.م</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button 
                                                    onClick={() => startEdit(product)} 
                                                    className="p-3 text-slate-400 hover:text-amber-500 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all"
                                                    title="تعديل المنتج"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(product.id)} 
                                                    className="p-3 text-slate-400 hover:text-red-500 bg-slate-950 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all"
                                                    title="حذف المنتج"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-slate-600 font-bold">لا توجد منتجات تطابق بحثك</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
                <form onSubmit={handleSettingsSubmit} className="space-y-8 pb-20">
                    {/* (Settings content remains same as previous version but integrated into enhanced layout) */}
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
                            <button type="button" onClick={testPixel} className="px-4 py-2 bg-slate-800 text-blue-400 border border-blue-400/20 rounded-xl text-xs font-black hover:bg-blue-400 hover:text-slate-900 transition-all flex items-center gap-2">
                                <Activity className="w-4 h-4" /> اختبار الربط
                            </button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3 mr-1">Facebook Pixel ID</label>
                                <input type="text" name="facebookPixelId" value={settingsForm.facebookPixelId} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-mono text-center" placeholder="123456789012345" />
                            </div>
                        </div>
                    </div>
                    {/* Custom Code Injection */}
                    <div className="bg-slate-900 rounded-[40px] border border-slate-800 p-8 md:p-10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                            <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
                                <Code className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-100">إضافة أكواد مخصصة</h3>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3 mr-1">كود الهيدر</label>
                                <textarea name="headerScripts" rows={6} value={settingsForm.headerScripts} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-300 font-mono text-xs" dir="ltr" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-slate-950 py-6 rounded-3xl font-black text-xl hover:bg-amber-400 shadow-2xl flex items-center justify-center gap-3">
                        <Save className="w-7 h-7" /> حفظ كافة الإعدادات المتقدمة
                    </button>
                </form>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-sm w-full shadow-2xl scale-in-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-100 text-center mb-2">حذف المنتج؟</h3>
                    <p className="text-slate-500 text-center mb-8 text-sm leading-relaxed">هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟ لا يمكن التراجع عن هذا الإجراء.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleDelete(deleteConfirmId)}
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition-all"
                        >
                            نعم، احذف
                        </button>
                        <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;