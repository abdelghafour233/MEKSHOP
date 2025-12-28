
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Category } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  AlertCircle, Activity, Code, Search, Upload, FileImage
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

  // معالجة رفع الصور وتحويلها لـ Base64
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
      // Fix: Cast the array to File[] to resolve the 'unknown' argument error on line 89
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
    alert('تم حفظ الإعدادات بنجاح!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 w-full max-w-md">
          <div className="text-center mb-10">
            <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-100">بريمة ستور - الإدارة</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="كلمة السر (admin123)"
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-center"
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4">
                <LayoutDashboard className="w-8 h-8 text-amber-500" />
                <h1 className="text-xl font-black text-slate-100">لوحة التحكم</h1>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'products' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>المنتجات</button>
                <button onClick={() => setActiveTab('settings')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>الإعدادات</button>
                <button onClick={handleLogout} className="p-2 text-red-500"><LogOut /></button>
            </div>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute right-3 top-3 w-5 h-5 text-slate-600" />
                    <input type="text" placeholder="بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none" />
                </div>
                <button onClick={() => setShowProductForm(true)} className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-xl font-black flex items-center gap-2">
                    <Plus className="w-5 h-5" /> منتج جديد
                </button>
            </div>

            {showProductForm && (
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">اسم المنتج</label>
                                <input required name="title" value={currentProduct.title || ''} onChange={handleInputChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">السعر</label>
                                    <input required type="number" name="price" value={currentProduct.price || ''} onChange={handleInputChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-amber-500 font-bold" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">السعر القديم</label>
                                    <input type="number" name="oldPrice" value={currentProduct.oldPrice || ''} onChange={handleInputChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">الوصف</label>
                                <textarea required name="description" rows={4} value={currentProduct.description || ''} onChange={handleInputChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 resize-none" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* الصورة الرئيسية */}
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">الصورة الرئيسية (رفع من الجهاز)</label>
                                <div 
                                    onClick={() => mainImageInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-800 rounded-2xl p-4 h-48 flex flex-col items-center justify-center bg-slate-950 cursor-pointer hover:border-amber-500 transition-all overflow-hidden"
                                >
                                    {currentProduct.imageUrl ? (
                                        <img src={currentProduct.imageUrl} className="h-full w-full object-contain" alt="Preview" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-slate-700 mb-2" />
                                            <span className="text-xs text-slate-600">اضغط لرفع الصورة</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" accept="image/*" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} />
                            </div>

                            {/* الصور الإضافية */}
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">صور إضافية (المعرض)</label>
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {currentProduct.additionalImages?.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center hover:border-blue-500 text-slate-700"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-4">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                <Save className="w-5 h-5" /> حفظ المنتج
                            </button>
                            <button type="button" onClick={resetProductForm} className="px-8 bg-slate-800 text-slate-400 rounded-xl">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-950 text-slate-500 text-xs">
                        <tr>
                            <th className="p-4">المنتج</th>
                            <th className="p-4">السعر</th>
                            <th className="p-4 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-slate-800/40">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={product.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                    <span className="font-bold text-slate-200">{product.title}</span>
                                </td>
                                <td className="p-4 text-amber-500 font-bold">{product.price} د.م</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => startEdit(product)} className="p-2 text-slate-400 hover:text-amber-500"><Edit className="w-5 h-5" /></button>
                                    <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-sm w-full">
                    <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">حذف المنتج؟</h3>
                    <div className="flex gap-4">
                        <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">حذف</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl">إلغاء</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
