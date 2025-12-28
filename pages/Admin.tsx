
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus, CartItem } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Lock, Settings as SettingsIcon, 
  Package, Facebook, Image as ImageIcon, 
  LogOut, Eye, EyeOff, ShoppingBag, LayoutDashboard,
  AlertCircle, Activity, Code, Search, Upload, FileImage,
  Globe, Database, Share2, ClipboardList, Clock, CheckCircle2, Truck, Ban,
  MessageSquare, Hash, DollarSign, Calendar, MoreVertical
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
        o.customer.phone.includes(orderSearch) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const stats = useMemo(() => {
    const confirmed = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');
    const totalSales = confirmed.reduce((acc, curr) => acc + curr.total, 0);
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

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('✅ تم حفظ الإعدادات بنجاح');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
        const newTotal = editingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const finalOrder = { ...editingOrder, total: newTotal };
        updateOrderDetails(finalOrder);
        setEditingOrder(null);
        alert('✅ تم تحديث الطلبية بنجاح');
    }
  };

  const updateItemQuantity = (productId: string, newQty: number) => {
    if (!editingOrder) return;
    if (newQty < 1) return;
    const updatedItems = editingOrder.items.map(item => 
        item.id === productId ? { ...item, quantity: newQty } : item
    );
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setEditingOrder({ ...editingOrder, items: updatedItems, total: newTotal });
  };

  const removeItemFromOrder = (productId: string) => {
    if (!editingOrder) return;
    if (editingOrder.items.length <= 1) return;
    const updatedItems = editingOrder.items.filter(item => item.id !== productId);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setEditingOrder({ ...editingOrder, items: updatedItems, total: newTotal });
  }

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
    alert('✅ تم حفظ المنتج بنجاح');
  };

  const resetProductForm = () => {
    setCurrentProduct({ category: Category.ELECTRONICS, features: [''], imageUrl: '', additionalImages: [] });
    setIsEditing(false);
    setShowProductForm(false);
  };

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Shipped': return 'bg-green-500/10 text-green-500 border-green-500/20';
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
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-[#0a0a0a] p-12 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Lock className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white">إدارة المتجر</h2>
            <p className="text-gray-500 text-sm mt-3 font-bold uppercase tracking-widest">لوحة التحكم السرية</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="كلمة السر"
              className="w-full p-6 bg-black border border-white/10 rounded-3xl text-white text-center outline-none focus:border-green-500 transition-all font-mono"
            />
            <button type="submit" className="w-full bg-green-500 text-black p-6 rounded-3xl font-black text-xl shadow-xl shadow-green-500/20 active:scale-95 transition-all">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl">
                <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">المبيعات المؤكدة</p>
                    <p className="text-4xl font-black text-green-500 mt-3">{stats.totalSales} د.م</p>
                </div>
                <div className="p-6 bg-green-500/10 rounded-3xl text-green-500 shadow-inner"><DollarSign size={32} /></div>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl">
                <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">طلبيات جديدة</p>
                    <p className="text-4xl font-black text-yellow-500 mt-3">{stats.pendingOrders}</p>
                </div>
                <div className="p-6 bg-yellow-500/10 rounded-3xl text-yellow-500 shadow-inner"><Clock size={32} /></div>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl">
                <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">إجمالي السجلات</p>
                    <p className="text-4xl font-black text-white mt-3">{stats.totalOrders}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl text-white shadow-inner"><ClipboardList size={32} /></div>
            </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-[#0a0a0a] p-3 rounded-[32px] border border-white/5 gap-4 shadow-xl">
            <div className="flex items-center bg-black p-2 rounded-2xl border border-white/5 w-full md:w-auto">
                <button onClick={() => setActiveTab('orders')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'orders' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}>
                    <ClipboardList size={20} /> الطلبيات
                </button>
                <button onClick={() => setActiveTab('products')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'products' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}>
                    <Package size={20} /> المنتجات
                </button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'settings' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}>
                    <SettingsIcon size={20} /> الإعدادات
                </button>
            </div>
            <button onClick={handleLogout} className="text-red-500 font-black px-8 py-4 hover:bg-red-500/10 rounded-[20px] transition-all flex items-center gap-2 border border-red-500/20">
                <LogOut size={20} /> خروج
            </button>
        </div>

        {activeTab === 'orders' && (
            <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-[500px]">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={24} />
                        <input 
                            type="text" 
                            placeholder="بحث في الطلبات..." 
                            value={orderSearch} 
                            onChange={(e) => setOrderSearch(e.target.value)} 
                            className="w-full pr-16 pl-6 py-6 bg-[#0a0a0a] border border-white/5 rounded-[32px] text-white outline-none focus:border-green-500 transition-all font-bold shadow-inner" 
                        />
                    </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 overflow-hidden shadow-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-black text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="p-8">الطلب</th>
                                    <th className="p-8">الزبون</th>
                                    <th className="p-8">المبلغ</th>
                                    <th className="p-8">الحالة</th>
                                    <th className="p-8 text-center">العمليات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-black rounded-2xl text-green-500 border border-white/5"><Hash size={18} /></div>
                                                <div>
                                                    <div className="text-white font-black text-lg">{order.id.split('-')[1]}</div>
                                                    <div className="text-gray-600 text-[10px] font-bold mt-1 uppercase">{new Date(order.date).toLocaleDateString('ar-MA')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="font-black text-white">{order.customer.fullName}</div>
                                            <div className="text-green-500 text-sm mt-1 font-mono" dir="ltr">{order.customer.phone}</div>
                                        </td>
                                        <td className="p-8">
                                            <div className="font-black text-white text-xl">{order.total} <span className="text-xs text-gray-500">د.م</span></div>
                                        </td>
                                        <td className="p-8">
                                            <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className="flex justify-center gap-4">
                                                <button onClick={() => setEditingOrder(order)} className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-black transition-all shadow-sm"><Edit size={22} /></button>
                                                <button onClick={() => setDeleteOrderConfirmId(order.id)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={22} /></button>
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

        {/* Edit Order Modal */}
        {editingOrder && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 overflow-y-auto">
                <div className="bg-[#0a0a0a] p-12 rounded-[56px] border border-white/10 w-full max-w-4xl shadow-3xl relative my-10">
                    <button onClick={() => setEditingOrder(null)} className="absolute left-10 top-10 p-4 bg-black text-gray-500 hover:text-white rounded-3xl transition-all border border-white/5"><X size={24} /></button>
                    
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-white flex items-center gap-5">
                            <div className="p-4 bg-green-500 rounded-3xl text-black"><Edit size={32} /></div>
                            تحديث بيانات الطلب
                        </h2>
                    </div>
                    
                    <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Customer Info */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 mb-3 mr-1 uppercase tracking-widest">اسم الزبون</label>
                                    <input required value={editingOrder.customer.fullName} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white outline-none focus:border-green-500 font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 mb-3 mr-1 uppercase tracking-widest">المدينة</label>
                                    <input required value={editingOrder.customer.city} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, city: e.target.value}})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white outline-none focus:border-green-500 font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 mb-3 mr-1 uppercase tracking-widest">رقم الهاتف</label>
                                    <input required value={editingOrder.customer.phone} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, phone: e.target.value}})} className="w-full p-5 bg-black border border-white/5 rounded-3xl text-white font-mono" dir="ltr" />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <label className="block text-[10px] font-black text-gray-500 mb-5 mr-1 uppercase tracking-widest">الحالة الحالية</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                                        <button 
                                            key={s} 
                                            type="button"
                                            onClick={() => setEditingOrder({...editingOrder, status: s})}
                                            className={`px-4 py-5 rounded-[24px] text-[10px] font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-current scale-105 shadow-xl' : 'bg-black text-gray-600 border-white/5 hover:border-white/20'}`}
                                        >
                                            {getStatusLabel(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Items & Notes */}
                        <div className="lg:col-span-7 space-y-10">
                            <div className="bg-black p-10 rounded-[40px] border border-white/5 shadow-inner">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8">سلة المنتجات</h3>
                                <div className="space-y-6">
                                    {editingOrder.items.map((it) => (
                                        <div key={it.id} className="flex items-center gap-5 bg-[#0a0a0a] p-5 rounded-[28px] border border-white/5 group">
                                            <img src={it.imageUrl} className="h-14 w-14 rounded-2xl object-cover border border-white/5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-white line-clamp-1">{it.title}</p>
                                                <p className="text-xs text-green-500 font-black mt-1">{it.price} د.م</p>
                                            </div>
                                            <div className="flex items-center bg-black rounded-2xl border border-white/10 px-3 py-1.5">
                                                <button type="button" onClick={() => updateItemQuantity(it.id, it.quantity - 1)} className="p-1 text-gray-500 hover:text-white transition-colors"><X size={14} className="rotate-45" /></button>
                                                <span className="w-10 text-center text-sm font-black text-white">{it.quantity}</span>
                                                <button type="button" onClick={() => updateItemQuantity(it.id, it.quantity + 1)} className="p-1 text-gray-500 hover:text-white transition-colors"><Plus size={14} /></button>
                                            </div>
                                            <button type="button" onClick={() => removeItemFromOrder(it.id)} className="p-3 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-gray-500 font-black text-xs uppercase tracking-widest">المجموع الكلي:</span>
                                    <span className="text-4xl font-black text-green-500">{editingOrder.total} <span className="text-base font-bold">د.م</span></span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-4 mr-1 uppercase tracking-widest">ملاحظات إدارية</label>
                                <textarea 
                                    value={editingOrder.notes || ''} 
                                    onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})} 
                                    className="w-full p-6 bg-black border border-white/5 rounded-[32px] text-gray-300 text-sm outline-none focus:border-green-500 min-h-[140px] resize-none leading-relaxed font-bold"
                                    placeholder="دون هنا تفاصيل المكالمة أو تعليمات التوصيل..."
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-12 flex flex-col md:flex-row gap-5 pt-12 border-t border-white/10">
                            <button type="submit" className="flex-1 bg-green-500 text-black py-7 rounded-[32px] font-black text-2xl shadow-3xl shadow-green-500/20 active:scale-95 transition-all">
                                حفظ التغييرات
                            </button>
                            <button type="button" onClick={() => setEditingOrder(null)} className="px-14 py-7 bg-white/5 text-gray-400 rounded-[32px] font-black hover:text-white transition-all border border-white/5">تجاهل</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Similar updates would apply to Products and Settings tabs, but basic flow is now Black/Green */}
      </div>
    </div>
  );
};

export default Admin;