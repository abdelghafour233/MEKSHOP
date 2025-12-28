
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, AlertCircle, ShoppingCart, User, Phone, MapPin, ChevronDown } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-[#0a0a0a] p-12 md:p-20 rounded-[48px] shadow-3xl max-w-2xl w-full text-center border border-white/5">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500 shadow-xl shadow-green-500/10">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">تم تسجيل طلبك بنجاح!</h2>
          <p className="text-gray-400 text-xl mb-12 leading-relaxed font-bold">شكراً لثقتك في berrima store. سنتصل بك قريباً عبر الهاتف لتأكيد طلبك وبدء عملية الشحن.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-green-500 text-black py-6 rounded-3xl font-black text-2xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 active:scale-95"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center md:text-right">
            <p className="text-green-500 font-black text-sm uppercase tracking-widest mb-4">الخطوة الأخيرة</p>
            <h1 className="text-5xl font-black text-white mb-6">تأكيد طلب الشراء</h1>
            <div className="h-2 w-24 bg-green-500 rounded-full mt-4 mx-auto md:mr-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="order-2 lg:order-1">
            <div className="bg-[#0a0a0a] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden sticky top-28">
              <div className="p-10 border-b border-white/5 flex items-center gap-4 bg-white/5">
                <ShoppingCart className="w-7 h-7 text-green-500" />
                <h2 className="text-2xl font-black text-white">ملخص المشتريات</h2>
              </div>
              <div className="p-10">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 mb-8 font-black text-xl">سلة المشتريات فارغة</p>
                    <button onClick={() => navigate('/products')} className="text-green-500 font-black text-lg hover:text-green-400">تصفح المنتجات الآن</button>
                  </div>
                ) : (
                  <ul className="space-y-8">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-6 group">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-[#111] p-1 border border-white/5">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-black text-white text-lg leading-snug line-clamp-1">{item.title}</h3>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-gray-500 text-xs font-black bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">الكمية: {item.quantity}</span>
                            <span className="font-black text-green-500 text-xl">{item.price * item.quantity} د.م</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-500 self-center p-3 rounded-2xl hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-6 w-6" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {cart.length > 0 && (
                  <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
                    <div className="flex justify-between text-3xl font-black text-white">
                      <span>الإجمالي</span>
                      <span className="text-green-500">{totalAmount} د.م</span>
                    </div>
                    <div className="bg-green-500/5 py-4 px-6 rounded-2xl border border-green-500/20">
                       <p className="text-green-500 text-xs font-black text-center flex items-center justify-center gap-2">
                           <CheckCircle className="w-4 h-4" /> توصيل منزلي مجاني لجميع المدن
                       </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-[#0a0a0a] rounded-[48px] shadow-3xl border border-white/5 p-10 md:p-14">
              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                  <div className="w-3 h-10 bg-green-500 rounded-full"></div>
                  معلومات الشحن
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                    <label className="block text-sm font-black text-gray-500 mb-4 mr-1 flex items-center gap-2 group-focus-within:text-green-500 transition-colors">
                        <User className="w-5 h-5" /> الاسم الكامل
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-7 py-5 bg-black border border-white/10 rounded-[28px] text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold placeholder:text-gray-700"
                        placeholder="أدخل اسمك الكامل"
                    />
                </div>

                <div className="relative group">
                    <label className="block text-sm font-black text-gray-500 mb-4 mr-1 flex items-center gap-2 group-focus-within:text-green-500 transition-colors">
                        <MapPin className="w-5 h-5" /> المدينة
                    </label>
                    <div className="relative">
                      <select
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-7 py-5 bg-black border border-white/10 rounded-[28px] text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all appearance-none cursor-pointer font-bold"
                      >
                          <option value="" disabled>اختر مدينتك</option>
                          {MOROCCAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none w-6 h-6" />
                    </div>
                </div>

                <div className="relative group">
                    <label className="block text-sm font-black text-gray-500 mb-4 mr-1 flex items-center gap-2 group-focus-within:text-green-500 transition-colors">
                        <Phone className="w-5 h-5" /> رقم الهاتف
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-7 py-5 bg-black border border-white/10 rounded-[28px] text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-mono text-left"
                        dir="ltr"
                        placeholder="06 XX XX XX XX"
                    />
                </div>

                <div className="bg-green-500/5 border border-green-500/20 rounded-[32px] p-8 flex gap-6 items-start">
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><AlertCircle className="h-8 w-8 flex-shrink-0" /></div>
                  <div className="space-y-2">
                    <p className="text-green-500 font-black text-lg">طريقة الدفع: عند الاستلام</p>
                    <p className="text-xs text-gray-500 leading-relaxed font-bold">
                        سيقوم فريقنا بالاتصال بك قريباً لتأكيد الطلب. الدفع يكون نقداً عند باب منزلك بعد فحص المنتج.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-7 rounded-[32px] font-black text-2xl shadow-3xl transition-all transform active:scale-95
                    ${isSubmitting || cart.length === 0 
                      ? 'bg-gray-900 text-gray-700 cursor-not-allowed border border-white/5' 
                      : 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20 hover:-translate-y-1'
                    }
                  `}
                >
                  {isSubmitting ? 'جاري التسجيل...' : 'إتمام الطلب الآن'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;