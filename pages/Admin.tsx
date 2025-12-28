import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  AlertCircle, Activity, Code, Search, Upload, FileImage,
  Globe, Database, Share2
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    category: Category.ELECTRONICS,
    features: [''],
    imageUrl: '',
    additionalImages: []
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettingsForm(prev => ({ ...prev, [name]: val }));
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await processFile(e.target.files[0]);
      setCurrentProduct(prev => ({ ...prev, imageUrl: base64 }));
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const base64Promises = files.map(file => processFile(file));
      const base64Images = await Promise.all(base64Promises);
      setCurrentProduct(prev => ({ 
        ...prev, 
        additionalImages: [...(prev.additionalImages || []), ...base64Images] 
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      additionalImages: prev.additionalImages?.filter((_, i) => i !== index)
    }));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.imageUrl) {
        alert('يرجى رفع صورة رئيسية للمنتج');
        return;
    }

    const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        oldPrice: currentProduct.oldPrice ? Number(currentProduct.oldPrice) : undefined,
        additionalImages: currentProduct.additionalImages || []
    } as Product;

    if (isEditing && currentProduct.id) {
      updateProduct(productData);
      alert('تم تحديث المنتج بنجاح');
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
      alert('تمت إضافة المنتج بنجاح');
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
    setCurrentProduct({ category: Category.ELECTRONICS, features: [''], imageUrl: '', additionalImages: [] });
    setIsEditing(false);
    setShowProductForm(false);
  };

  const handleDelete = (id: string) => {
      deleteProduct(id);
      setDeleteConfirmId(null);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 w-full max-w-md shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-100">بريمة ستور - الإدارة</h2>
            <p className="text-slate-500 text-sm mt-2">يرجى إدخال كلمة المرور للمتابعة</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="كلمة السر"
                  className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-center focus:border-amber-500 outline-none transition-all"
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-950 p-5 rounded-2xl font-black text-lg hover:bg-amber-400 shadow-xl shadow-amber-500/10">دخول للنظام</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-slate-900 p-4 rounded-3xl border border-slate-800 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <LayoutDashboard className="w-6 h-6 text-amber-500" />
                </div>
                <h1 className="text-xl font-black text-slate-100">لوحة تحكم المتجر</h1>
            </div>
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button 
                    onClick={() => setActiveTab('products')} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Package size={18} /> المنتجات
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <SettingsIcon size={18} /> الإعدادات
                </button>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-3 text-red-500 font-bold hover:bg-red-500/5 rounded-2xl transition-all">
                <LogOut size={18} /> خروج
            </button>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="بحث عن منتج..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pr-12 pl-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-amber-500 transition-all shadow-inner" 
                    />
                </div>
                <button onClick={() => setShowProductForm(true)} className="w-full md:w-auto bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 hover:bg-amber-400">
                    <Plus className="w-6 h-6" /> إضافة منتج جديد
                </button>
            </div>

            {showProductForm && (
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-2xl relative">
                    <button onClick={resetProductForm} className="absolute left-6 top-6 text-slate-500 hover:text-white p-2 bg-slate-800 rounded-xl"><X /></button>
                    <h2 className="text-2xl font-black text-slate-100 mb-8 flex items-center gap-3">
                        {isEditing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                    </h2>
                    
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">عنوان المنتج</label>
                                <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3">السعر الحالي (د.م)</label>
                                    <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-amber-500 font-black outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3">السعر القديم</label>
                                    <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 line-through outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">وصف المنتج</label>
                                <textarea required name="description" rows={5} value={currentProduct.description || ''} onChange={handleInputChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-300 resize-none outline-none focus:border-amber-500 leading-relaxed" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-4">صورة المنتج الرئيسية</label>
                                <div 
                                    onClick={() => mainImageInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-800 rounded-3xl h-64 flex flex-col items-center justify-center bg-slate-950 cursor-pointer hover:border-amber-500 transition-all group relative overflow-hidden"
                                >
                                    {currentProduct.imageUrl ? (
                                        <>
                                            <img src={currentProduct.imageUrl} className="h-full w-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="text-white w-10 h-10" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            <p className="text-sm text-slate-600 font-bold">اضغط أو اسحب صورة المنتج هنا</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-4">معرض الصور (صور إضافية)</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {currentProduct.additionalImages?.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-lg">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-lg shadow-xl"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 text-slate-600 transition-all bg-slate-950"
                                    >
                                        <Plus className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-bold">أضف صورة</span>
                                    </button>
                                </div>
                                <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-800">
                            <button type="submit" className="flex-1 bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10">
                                <Save className="w-6 h-6" /> حفظ بيانات المنتج
                            </button>
                            <button type="button" onClick={resetProductForm} className="px-10 py-5 bg-slate-800 text-slate-400 rounded-2xl font-bold hover:text-white transition-all">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-100 flex items-center gap-2"><Activity size={18} className="text-blue-500" /> قائمة المنتجات الحالية</h3>
                    <div className="text-xs text-slate-500 font-bold">إجمالي: {filteredProducts.length} منتج</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-black uppercase tracking-wider">
                            <tr>
                                <th className="p-5">المنتج</th>
                                <th className="p-5">التصنيف</th>
                                <th className="p-5">السعر</th>
                                <th className="p-5 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                                                <img src={product.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-slate-200 line-clamp-1">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-bold text-slate-500 border border-slate-800 uppercase tracking-tighter">{product.category}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-black text-amber-500">{product.price} د.م</span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => startEdit(product)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit size={18} /></button>
                                            <button onClick={() => setDeleteConfirmId(product.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-left duration-500">
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
                
                {/* Facebook Pixel & Ads Section */}
                <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                            <Facebook size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-100">إعدادات فيسبوك بيكسل</h2>
                            <p className="text-xs text-slate-500 font-bold mt-1">اربط متجرك بحملات فيسبوك الإعلانية</p>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-3">Facebook Pixel ID</label>
                            <input 
                                type="text" 
                                name="facebookPixelId" 
                                value={settingsForm.facebookPixelId} 
                                onChange={handleSettingsChange}
                                placeholder="مثال: 1234567890123"
                                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-3">Facebook Test Event Code (كود الاختبار)</label>
                            <div className="relative">
                                <Code className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                <input 
                                    type="text" 
                                    name="fbTestEventCode" 
                                    value={settingsForm.fbTestEventCode} 
                                    onChange={handleSettingsChange}
                                    placeholder="مثال: TEST12345"
                                    className="w-full pr-12 pl-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-emerald-500 transition-all font-mono"
                                />
                            </div>
                            <p className="text-[10px] text-slate-600 mt-2 pr-1 font-bold">استخدم هذا الكود لاختبار الأحداث في Events Manager</p>
                        </div>
                    </div>
                </div>

                {/* Google & TikTok Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Share2 size={24} /></div>
                            <h2 className="text-lg font-black text-slate-100">Google & TikTok</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">Google Tag ID (G-XXXXX)</label>
                                <input type="text" name="googleTagId" value={settingsForm.googleTagId} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">TikTok Pixel ID</label>
                                <input type="text" name="tiktokPixelId" value={settingsForm.tiktokPixelId} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Google Sheets Section */}
                    <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><Database size={24} /></div>
                            <h2 className="text-lg font-black text-slate-100">ربط الطلبات (Google Sheets)</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-3">رابط Webhook أو App Script</label>
                            <input 
                                type="text" 
                                name="googleSheetUrl" 
                                value={settingsForm.googleSheetUrl} 
                                onChange={handleSettingsChange} 
                                placeholder="https://script.google.com/macros/s/..."
                                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-emerald-500" 
                            />
                            <div className="mt-4 flex gap-2 items-start bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                                <AlertCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">سيتم إرسال كل طلب جديد تلقائياً إلى هذا الرابط لتنظيم طلباتك في جدول بيانات.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-amber-500 text-slate-950 px-16 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-amber-500/20 hover:bg-amber-400 flex items-center justify-center gap-3">
                        <Save /> حفظ جميع الإعدادات
                    </button>
                </div>

            </form>
          </div>
        )}

        {/* Delete Modal */}
        {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 max-w-sm w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <Trash2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-100 mb-4">هل أنت متأكد؟</h3>
                    <p className="text-slate-500 mb-10 font-bold">سيتم حذف هذا المنتج نهائياً ولا يمكن استعادته لاحقاً.</p>
                    <div className="flex gap-4">
                        <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-500 transition-all">نعم، احذف</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black hover:text-white transition-all">إلغاء</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
