
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  AlertCircle, Activity, Code, Search, Upload, FileImage,
  Globe, Database, Share2, ClipboardList, Clock, CheckCircle2, Truck, Ban
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, updateOrderStatus, deleteOrder, updateOrderDetails } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders'>('orders');
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteOrderConfirmId, setDeleteOrderConfirmId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    category: Category.ELECTRONICS,
    features: [''],
    imageUrl: '',
    additionalImages: []
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState(settings);

  // Order Editing State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'admin123') setIsAuthenticated(true);
    else alert('كلمة المرور غير صحيحة. جرب: admin123');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || 
        o.customer.phone.includes(orderSearch)
    );
  }, [orders, orderSearch]);

  const stats = useMemo(() => {
    const totalSales = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped').reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    return { totalSales, pendingOrders, totalOrders: orders.length };
  }, [orders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettingsForm(prev => ({ ...prev, [name]: val }));
  };

  // Fix: Added missing handleSettingsSubmit to correctly process and persist admin setting changes.
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
        updateOrderDetails(editingOrder);
        setEditingOrder(null);
        alert('تم تحديث بيانات الطلب');
    }
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
    if (!currentProduct.imageUrl) { alert('يرجى رفع صورة رئيسية'); return; }

    const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        oldPrice: currentProduct.oldPrice ? Number(currentProduct.oldPrice) : undefined,
        additionalImages: currentProduct.additionalImages || []
    } as Product;

    if (isEditing && currentProduct.id) updateProduct(productData);
    else addProduct({ ...productData, id: Date.now().toString() });
    
    resetProductForm();
    alert('تم حفظ المنتج');
  };

  const resetProductForm = () => {
    setCurrentProduct({ category: Category.ELECTRONICS, features: [''], imageUrl: '', additionalImages: [] });
    setIsEditing(false);
    setShowProductForm(false);
  };

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
          case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Shipped': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 w-full max-w-md shadow-2xl">
          <div className="text-center mb-10">
            <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-100">بريمة ستور - الإدارة</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="كلمة السر"
              className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-center outline-none focus:border-amber-500"
            />
            <button type="submit" className="w-full bg-amber-500 text-slate-950 p-5 rounded-2xl font-black text-lg">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-bold">إجمالي المبيعات</p>
                    <p className="text-2xl font-black text-emerald-500 mt-1">{stats.totalSales} د.م</p>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Activity /></div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-bold">طلبات قيد الانتظار</p>
                    <p className="text-2xl font-black text-amber-500 mt-1">{stats.pendingOrders}</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500"><Clock /></div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-bold">إجمالي الطلبيات</p>
                    <p className="text-2xl font-black text-blue-500 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><ClipboardList /></div>
            </div>
        </div>

        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-slate-900 p-4 rounded-3xl border border-slate-800 gap-4">
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full md:w-auto">
                <button onClick={() => setActiveTab('orders')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}>
                    <ClipboardList size={18} /> الطلبيات
                </button>
                <button onClick={() => setActiveTab('products')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}>
                    <Package size={18} /> المنتجات
                </button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}>
                    <SettingsIcon size={18} /> الإعدادات
                </button>
            </div>
            <button onClick={handleLogout} className="text-red-500 font-bold px-4 py-2 hover:bg-red-500/10 rounded-xl transition-all"><LogOut size={20} /></button>
        </div>

        {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                        <input type="text" placeholder="ابحث باسم الزبون أو رقم الهاتف..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pr-12 pl-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-amber-500" />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-950 text-slate-500 text-xs font-black uppercase">
                                <tr>
                                    <th className="p-5">التاريخ / الطلب</th>
                                    <th className="p-5">الزبون</th>
                                    <th className="p-5">المنتجات</th>
                                    <th className="p-5">الإجمالي</th>
                                    <th className="p-5">الحالة</th>
                                    <th className="p-5 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-5">
                                            <div className="text-slate-200 font-bold text-xs">{order.id}</div>
                                            <div className="text-slate-500 text-[10px] mt-1">{new Date(order.date).toLocaleString('ar-MA')}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-200">{order.customer.fullName}</div>
                                            <div className="text-slate-500 text-xs mt-1" dir="ltr">{order.customer.phone}</div>
                                            <div className="text-slate-600 text-[10px]">{order.customer.city}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="max-w-[200px] truncate text-slate-400 text-xs font-medium">
                                                {order.items.map(i => `${i.title} (x${i.quantity})`).join('، ')}
                                            </div>
                                        </td>
                                        <td className="p-5 font-black text-amber-500">{order.total} د.م</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => setEditingOrder(order)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit size={16} /></button>
                                                <button onClick={() => setDeleteOrderConfirmId(order.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-20 text-center text-slate-500 font-bold">لا توجد طلبيات حالياً</div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Modal: Edit Order */}
        {editingOrder && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-100">تعديل الطلب: {editingOrder.id}</h2>
                        <button onClick={() => setEditingOrder(null)} className="p-2 text-slate-500 hover:text-white"><X /></button>
                    </div>
                    
                    <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">اسم الزبون</label>
                                <input required value={editingOrder.customer.fullName} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">المدينة</label>
                                <input required value={editingOrder.customer.city} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, city: e.target.value}})} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">الهاتف</label>
                                <input required value={editingOrder.customer.phone} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, phone: e.target.value}})} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-3">تغيير حالة الطلب</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                                        <button 
                                            key={s} 
                                            type="button"
                                            onClick={() => setEditingOrder({...editingOrder, status: s})}
                                            className={`px-4 py-3 rounded-xl text-xs font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-current scale-105' : 'bg-slate-950 text-slate-600 border-slate-800'}`}
                                        >
                                            {getStatusLabel(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                                <h3 className="text-xs font-black text-slate-500 mb-4 uppercase">المنتجات المطلوبة</h3>
                                <ul className="space-y-2">
                                    {editingOrder.items.map((it, idx) => (
                                        <li key={idx} className="flex justify-between text-xs font-bold text-slate-300">
                                            <span>{it.title}</span>
                                            <span className="text-amber-500">x{it.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between font-black text-slate-100">
                                    <span>المجموع:</span>
                                    <span className="text-emerald-500">{editingOrder.total} د.م</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-4 pt-6">
                            <button type="submit" className="flex-1 bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl shadow-xl shadow-amber-500/10">حفظ التغييرات</button>
                            <button type="button" onClick={() => setEditingOrder(null)} className="px-10 py-5 bg-slate-800 text-slate-400 rounded-2xl font-bold">إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal: Delete Order Confirm */}
        {deleteOrderConfirmId && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 max-w-sm w-full text-center shadow-2xl">
                    <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-100 mb-4">حذف الطلب؟</h3>
                    <p className="text-slate-500 mb-10 font-bold">سيتم حذف هذا الطلب نهائياً من سجل المبيعات.</p>
                    <div className="flex gap-4">
                        <button onClick={() => { deleteOrder(deleteOrderConfirmId); setDeleteOrderConfirmId(null); }} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black">حذف نهائي</button>
                        <button onClick={() => setDeleteOrderConfirmId(null)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black">تراجع</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <input type="text" placeholder="بحث عن منتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-12 pl-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-amber-500 transition-all shadow-inner" />
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
                                        <img src={currentProduct.imageUrl} className="h-full w-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            <p className="text-sm text-slate-600 font-bold">اضغط لرفع الصورة</p>
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
                                            <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-lg shadow-xl"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 text-slate-600 bg-slate-950">
                                        <Plus className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-bold">أضف صورة</span>
                                    </button>
                                </div>
                                <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-800">
                            <button type="submit" className="flex-1 bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10">
                                <Save className="w-6 h-6" /> حفظ المنتج
                            </button>
                            <button type="button" onClick={resetProductForm} className="px-10 py-5 bg-slate-800 text-slate-400 rounded-2xl font-bold">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-black uppercase">
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
                                    <td className="p-5 flex items-center gap-4">
                                        <img src={product.imageUrl} className="w-14 h-14 rounded-xl object-cover border border-slate-800" />
                                        <span className="font-bold text-slate-200">{product.title}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-bold text-slate-500 border border-slate-800">{product.category}</span>
                                    </td>
                                    <td className="p-5 text-amber-500 font-black">{product.price} د.م</td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => { setIsEditing(true); setCurrentProduct(product); setShowProductForm(true); }} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Edit size={18} /></button>
                                            <button onClick={() => setDeleteConfirmId(product.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="animate-in slide-in-from-left duration-500">
            <form onSubmit={handleSettingsSubmit} className="space-y-8">
                <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Facebook size={24} className="text-blue-500" />
                        <h2 className="text-xl font-black text-slate-100">إعدادات فيسبوك</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-3">Facebook Pixel ID</label>
                            <input type="text" name="facebookPixelId" value={settingsForm.facebookPixelId} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-3">Facebook Test Event Code</label>
                            <input type="text" name="fbTestEventCode" value={settingsForm.fbTestEventCode} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <Database size={24} className="text-emerald-500" />
                        <h2 className="text-xl font-black text-slate-100">جوجل شيت (Webhook)</h2>
                    </div>
                    <input type="text" name="googleSheetUrl" value={settingsForm.googleSheetUrl} onChange={handleSettingsChange} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 outline-none focus:border-emerald-500" placeholder="رابط الـ Webhook الخاص بك" />
                </div>

                <button type="submit" className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl shadow-2xl">حفظ الإعدادات</button>
            </form>
          </div>
        ) : null}

        {/* Delete Confirm Modals */}
        {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 max-w-sm w-full text-center">
                    <h3 className="text-2xl font-black text-slate-100 mb-10">هل تريد حذف المنتج؟</h3>
                    <div className="flex gap-4">
                        <button onClick={() => { deleteProduct(deleteConfirmId); setDeleteConfirmId(null); }} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black">حذف</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black">إلغاء</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
