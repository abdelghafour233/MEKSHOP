
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, CheckCircle, AlertCircle, ShoppingCart, 
  User, Phone, MapPin, ChevronDown, ShieldCheck, 
  Truck, CreditCard, Award, ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrderContext';
import { trackPurchaseEvent } from '../components/TrackingScripts';
import { OrderForm, Order } from '../types';

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أغادير", "مكناس", "وجدة",
  "القنيطرة", "تطوان", "تمارة", "آسفي", "العيون", "المحمدية", "بني ملال", "الجديدة",
  "تازة", "الناظور", "سطات", "القصر الكبير", "العرائش", "خميسات", "تيزنيت", "برشيد",
  "وادي زم", "الفقيه بن صالح", "تاوريرت", "بركان", "سيدي سليمان", "الرشيدية", "سيدي قاسم", "خنيفرة"
].sort();

const Checkout: React.FC = () => {
  const { cart, removeFromCart, totalAmount, clearCart } = useCart();
  const { settings } = useSettings();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<OrderForm>({
    fullName: '',
    phone: '',
    city: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!formData.city) {
      alert("المرجو اختيار المدينة");
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        customer: formData,
        items: [...cart],
        total: totalAmount,
        status: 'Pending'
    };

    addOrder(newOrder);

    if (settings.googleSheetUrl) {
        try {
            await fetch(settings.googleSheetUrl, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newOrder,
                    items: cart.map(item => `${item.title} (x${item.quantity})`).join(', ')
                })
            });
        } catch (error) {
            console.error("Error sending to Google Sheet", error);
        }
    }

    trackPurchaseEvent(settings, totalAmount, 'MAD');

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      clearCart();
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4 transition-colors duration-500">
        <div className="bg-white dark:bg-[#0a0a0a] p-12 md:p-20 rounded-[56px] shadow-3xl max-w-2xl w-full text-center border border-slate-200 dark:border-white/5 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-green-600 dark:text-green-500 shadow-2xl shadow-green-500/20">
            <CheckCircle className="h-16 w-16" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">تهانينا! تم تسجيل طلبك</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xl mb-12 leading-relaxed font-bold">
            شكراً لاختيارك <span className="text-green-600 font-black">berrima store</span>. 
            <br className="hidden md:block"/> فريقنا سيقوم بالاتصال بك خلال الساعات القادمة لتأكيد الشحن.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black py-7 rounded-[32px] font-black text-2xl hover:bg-green-500 dark:hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 active:scale-95"
          >
            متابعة التسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-right">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">تأكيد طلب الشراء</h1>
                <p className="text-slate-500 dark:text-gray-500 font-bold text-lg">أدخل معلوماتك بدقة لضمان وصول طلبك في أقرب وقت</p>
            </div>
            <button onClick={() => navigate('/products')} className="flex items-center gap-3 bg-white dark:bg-[#0a0a0a] px-8 py-4 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-gray-400 font-black hover:text-green-600 transition-all group shadow-sm">
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> العودة للمتجر
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[48px] shadow-2xl border border-slate-200 dark:border-white/5 p-10 md:p-14 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-2 h-full bg-green-600 dark:bg-green-500"></div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-600 dark:text-green-500"><User className="w-8 h-8" /></div>
                  المعلومات الشخصية
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-500 dark:text-gray-500 mr-2 uppercase tracking-widest">الاسم الكامل</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-white/5 rounded-[28px] text-slate-900 dark:text-white focus:border-green-600 dark:focus:border-green-500 outline-none transition-all font-bold text-lg shadow-inner"
                                placeholder=""
                            />
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-700 w-6 h-6" />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-500 dark:text-gray-500 mr-2 uppercase tracking-widest">رقم الهاتف</label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-white/5 rounded-[28px] text-slate-900 dark:text-white focus:border-green-600 dark:focus:border-green-500 outline-none transition-all font-mono text-left text-lg shadow-inner"
                                dir="ltr"
                                placeholder=""
                            />
                            <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-700 w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* City Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-black text-slate-500 dark:text-gray-500 mr-2 uppercase tracking-widest">المدينة</label>
                    <div className="relative">
                      <select
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-8 py-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-white/5 rounded-[28px] text-slate-900 dark:text-white focus:border-green-600 dark:focus:border-green-500 outline-none transition-all appearance-none cursor-pointer font-bold text-lg shadow-inner"
                      >
                          <option value="" disabled>-- اختر مدينتك --</option>
                          {MOROCCAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-600 pointer-events-none w-6 h-6" />
                      <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-700 w-6 h-6" />
                    </div>
                </div>

                {/* Trust Section */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-8 border border-slate-200 dark:border-white/5 space-y-6">
                    <div className="flex gap-5 items-start">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-600 dark:text-green-500">
                            <CreditCard className="h-7 w-7 flex-shrink-0" />
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-black text-xl mb-1">الدفع عند الاستلام</p>
                            <p className="text-sm text-slate-500 dark:text-gray-500 leading-relaxed font-bold">
                                خدمة الدفع عند الاستلام متاحة لجميع المدن. لا تطلب منك بطاقة بنكية حالياً، ادفع نقداً بعد استلام منتجك.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5 items-start border-t border-slate-200 dark:border-white/10 pt-6">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-600 dark:text-green-500">
                            <ShieldCheck className="h-7 w-7 flex-shrink-0" />
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-black text-xl mb-1">ضمان الاسترجاع</p>
                            <p className="text-sm text-slate-500 dark:text-gray-500 leading-relaxed font-bold">
                                نضمن لك جودة المنتج 100%. في حالة وجود أي عيب مصنعي، يمكنك استرجاع أموالك أو تبديل المنتج مجاناً.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-8 rounded-[32px] font-black text-3xl shadow-3xl transition-all transform active:scale-95 group relative overflow-hidden
                    ${isSubmitting || cart.length === 0 
                      ? 'bg-slate-200 dark:bg-gray-900 text-slate-400 dark:text-gray-700 cursor-not-allowed' 
                      : 'bg-green-600 dark:bg-green-500 text-white dark:text-black hover:bg-green-500 dark:hover:bg-green-400 shadow-green-500/30'
                    }
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? 'جاري تسجيل طلبك...' : 'أكد الطلب الآن'}
                    {!isSubmitting && <Truck className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar / Order Summary Area */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[48px] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden sticky top-28">
              <div className="p-10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                <div className="flex items-center gap-4">
                    <ShoppingCart className="w-7 h-7 text-green-600 dark:text-green-500" />
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">ملخص الطلب</h2>
                </div>
                <span className="bg-green-600 dark:bg-green-500 text-white dark:text-black px-4 py-1 rounded-full text-xs font-black">{cart.length} منتجات</span>
              </div>
              
              <div className="p-10">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-slate-500 dark:text-gray-500 mb-8 font-black text-xl">السلة فارغة</p>
                    <button onClick={() => navigate('/products')} className="text-green-600 dark:text-green-500 font-black text-lg hover:underline">ابدأ التسوق</button>
                  </div>
                ) : (
                  <ul className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-6 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-[#111] p-1 border border-slate-200 dark:border-white/5 shadow-sm">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug line-clamp-1">{item.title}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-slate-500 dark:text-gray-500 text-xs font-black">الكمية: {item.quantity}</span>
                            <span className="font-black text-green-600 dark:text-green-500 text-lg">{item.price * item.quantity} د.م</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 self-center p-2 rounded-xl hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {cart.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/5 space-y-6">
                    <div className="flex justify-between items-center text-slate-500 dark:text-gray-500 font-bold">
                        <span>المجموع الفرعي</span>
                        <span>{totalAmount} د.م</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600 dark:text-green-500 font-black">
                        <span>الشحن (توصيل منزلي)</span>
                        <span className="text-xs bg-green-500/10 px-3 py-1 rounded-lg uppercase tracking-widest">مجاني</span>
                    </div>
                    <div className="flex justify-between items-center text-4xl font-black text-slate-900 dark:text-white pt-4">
                      <span>الإجمالي</span>
                      <span className="text-green-600 dark:text-green-500">{totalAmount} د.م</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why Buy From Us Bar */}
            <div className="bg-green-600 dark:bg-green-500 p-8 rounded-[40px] text-white dark:text-black shadow-2xl">
                <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    لماذا berrima store؟
                </h3>
                <ul className="space-y-4 text-sm font-bold opacity-90">
                    <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" /> فحص المنتج قبل الدفع
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" /> توصيل سريع (24-48 ساعة)
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" /> خدمة ما بعد البيع متميزة
                    </li>
                </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
