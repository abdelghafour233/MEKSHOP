
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { Product, Category, Order, OrderStatus } from '../types';
import { 
  Plus, Edit, Trash2, X, Lock, Settings as SettingsIcon, 
  Package, LogOut, Eye, EyeOff, ShoppingBag, 
  Search, Hash, DollarSign, Clock, ClipboardList, Award, Truck, AlertCircle
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { orders, updateOrderStatus, deleteOrder, updateOrderDetails } = useOrders();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders'>('orders');
  
  const [orderSearch, setOrderSearch] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteOrderConfirmId, setDeleteOrderConfirmId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'admin123') setIsAuthenticated(true);
    else alert('كلمة المرور غير صحيحة. جرب: admin123');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setShowPassword(false);
  };

  const stats = useMemo(() => {
    const confirmed = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped');
    const totalSales = confirmed.reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    return { totalSales, pendingOrders, totalOrders: orders.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || 
        o.customer.phone.includes(orderSearch) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Shipped': return 'bg-green-500/10 text-green-600 border-green-500/20';
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

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
        updateOrderDetails(editingOrder);
        setEditingOrder(null);
        alert('✅ تم تحديث الطلبية بنجاح');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-[#0a0a0a] p-10 md:p-14 rounded-[48px] border border-white/5 w-full max-w-md shadow-3xl text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">إدارة المتجر</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-10">منطقة محظورة</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="أدخل كلمة المرور"
                className="w-full p-5 bg-black border border-white/10 rounded-2xl text-white text-center outline-none focus:border-green-500 transition-all font-mono placeholder:text-gray-700"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-500 transition-colors p-2"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-green-500 text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                دخول للنظام
            </button>
          </form>
          <p className="mt-8 text-gray-700 text-[10px] font-bold uppercase tracking-widest">admin123 :كلمة السر التجريبية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 md:py-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Header with Eye Icon */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/20">
                    <ShoppingBag className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">berrima store management</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 bg-green-500/10 text-green-500 px-6 py-3.5 rounded-2xl border border-green-500/20 font-black hover:bg-green-500 hover:text-black transition-all group"
                >
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    معاينة المتجر
                </Link>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-3.5 rounded-2xl border border-red-500/20 font-black hover:bg-red-500 hover:text-white transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    خروج
                </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
                <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">المبيعات المؤكدة</p>
                    <p className="text-3xl font-black text-white">{stats.totalSales} <span className="text-sm opacity-50">د.م</span></p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-2xl text-green-500"><DollarSign size={28} /></div>
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-yellow-500"></div>
                <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">طلبات معلقة</p>
                    <p className="text-3xl font-black text-white">{stats.pendingOrders}</p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500"><Clock size={28} /></div>
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
                <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">إجمالي السجلات</p>
                    <p className="text-3xl font-black text-white">{stats.totalOrders}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><ClipboardList size={28} /></div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0a0a0a] p-2 rounded-[28px] border border-white/5 mb-10 flex flex-wrap gap-2 shadow-xl">
            <button 
                onClick={() => setActiveTab('orders')} 
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
                <ClipboardList size={18} /> الطلبيات
            </button>
            <button 
                onClick={() => setActiveTab('products')} 
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${activeTab === 'products' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
                <Package size={18} /> المنتجات
            </button>
            <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${activeTab === 'settings' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
                <SettingsIcon size={18} /> الإعدادات
            </button>
        </div>

        {activeTab === 'orders' && (
            <div className="space-y-8">
                <div className="relative">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input 
                        type="text" 
                        placeholder="ابحث عن زبون، رقم هاتف، أو رقم طلب..." 
                        value={orderSearch} 
                        onChange={(e) => setOrderSearch(e.target.value)} 
                        className="w-full pr-16 pl-6 py-5 bg-[#0a0a0a] border border-white/5 rounded-3xl text-white outline-none focus:border-green-500 transition-all font-bold" 
                    />
                </div>

                <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-black/50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="p-6">رقم الطلب</th>
                                    <th className="p-6">المعلومات</th>
                                    <th className="p-6">السعر</th>
                                    <th className="p-6">الحالة</th>
                                    <th className="p-6 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-black rounded-lg text-gray-500 group-hover:text-green-500 border border-white/5"><Hash size={14} /></div>
                                                <span className="text-white font-black">{order.id.split('-')[1]}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-black text-white text-sm">{order.customer.fullName}</div>
                                            <div className="text-green-500 text-xs mt-1 font-mono" dir="ltr">{order.customer.phone}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-black text-white">{order.total} د.م</div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-3">
                                                <button 
                                                    onClick={() => setEditingOrder(order)} 
                                                    className="p-3 bg-white/5 text-white rounded-xl hover:bg-green-500 hover:text-black transition-all"
                                                    title="عرض وتعديل"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => { if(window.confirm('هل أنت متأكد من حذف الطلب؟')) deleteOrder(order.id); }} 
                                                    className="p-3 bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all rounded-xl"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-20 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold">لم يتم العثور على أي طلبيات مطابقة للبحث.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Modal: Edit Order */}
        {editingOrder && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
                <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-[56px] border border-white/10 w-full max-w-4xl shadow-3xl relative my-8 animate-in zoom-in duration-300">
                    <button 
                        onClick={() => setEditingOrder(null)} 
                        className="absolute left-8 top-8 p-3 bg-black text-gray-500 hover:text-white rounded-2xl transition-all border border-white/5"
                    >
                        <X size={24} />
                    </button>
                    
                    <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><Eye size={28} /></div>
                        تفاصيل الطلبية
                    </h2>
                    
                    <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">معلومات الزبون</h3>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                                <input value={editingOrder.customer.fullName} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, fullName: e.target.value}})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white outline-none focus:border-green-500 font-bold" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">المدينة</label>
                                <input value={editingOrder.customer.city} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, city: e.target.value}})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white outline-none focus:border-green-500 font-bold" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">رقم الهاتف</label>
                                <input value={editingOrder.customer.phone} onChange={(e) => setEditingOrder({...editingOrder, customer: {...editingOrder.customer, phone: e.target.value}})} className="w-full p-4 bg-black border border-white/5 rounded-2xl text-white font-mono" dir="ltr" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">حالة الطلب والمنتجات</h3>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-widest">تغيير الحالة</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Pending', 'Confirmed', 'Shipped', 'Cancelled'] as OrderStatus[]).map(s => (
                                        <button 
                                            key={s} 
                                            type="button"
                                            onClick={() => setEditingOrder({...editingOrder, status: s})}
                                            className={`py-3 rounded-xl text-[10px] font-black border transition-all ${editingOrder.status === s ? getStatusColor(s) + ' border-current' : 'bg-black text-gray-600 border-white/5'}`}
                                        >
                                            {getStatusLabel(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-black p-6 rounded-3xl border border-white/5 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {editingOrder.items.map(it => (
                                    <div key={it.id} className="flex justify-between items-center mb-4 last:mb-0">
                                        <span className="text-sm font-bold text-white">{it.title} (x{it.quantity})</span>
                                        <span className="text-xs text-green-500 font-black">{it.price * it.quantity} د.م</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-gray-500 font-black text-xs uppercase tracking-widest">الإجمالي:</span>
                                <span className="text-2xl font-black text-green-500">{editingOrder.total} د.م</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-8 flex gap-4">
                            <button type="submit" className="flex-1 bg-green-500 text-black py-5 rounded-2xl font-black text-xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/10">
                                حفظ التغييرات
                            </button>
                            <button type="button" onClick={() => setEditingOrder(null)} className="px-10 py-5 bg-white/5 text-white rounded-2xl font-black border border-white/5 hover:bg-white/10 transition-all">
                                إغلاق
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
