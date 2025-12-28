import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, AlertCircle, ShoppingCart, User, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { trackPurchaseEvent } from '../components/TrackingScripts';
import { OrderForm } from '../types';

const Checkout: React.FC = () => {
  const { cart, removeFromCart, totalAmount, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<OrderForm>({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const orderData = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        customer: formData,
        items: cart.map(item => `${item.title} (x${item.quantity})`).join(', '),
        total: totalAmount,
        status: 'Pending'
    };

    if (settings.googleSheetUrl) {
        try {
            await fetch(settings.googleSheetUrl, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 p-10 md:p-16 rounded-[40px] shadow-2xl max-w-2xl w-full text-center border border-slate-800">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-slate-100 mb-6">شكراً لطلبك من berrima store!</h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">تم استلام طلبك بنجاح. سيقوم أحد موظفينا بالتواصل معك عبر الهاتف خلال الساعات القادمة لتأكيد العنوان وموعد التوصيل.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
          >
            العودة للرئيسية وتصفح المزيد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-100 mb-4">إتمام عملية الشراء</h1>
            <div className="h-1.5 w-20 bg-amber-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Order Summary - Dark Side */}
          <div className="order-2 lg:order-1">
            <div className="bg-slate-900 rounded-[32px] shadow-xl border border-slate-800 overflow-hidden sticky top-24">
              <div className="p-8 border-b border-slate-800 flex items-center gap-4">
                <ShoppingCart className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-black text-slate-100">ملخص سلة المشتريات</h2>
              </div>
              <div className="p-8">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 mb-6 font-bold">سلة المشتريات فارغة تماماً</p>
                    <button onClick={() => navigate('/products')} className="text-amber-500 font-black hover:text-amber-400">تصفح المنتجات الآن</button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-5 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950 p-1 border border-slate-800">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-1">{item.title}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-slate-500 text-xs font-black bg-slate-950 px-2 py-1 rounded-lg">الكمية: {item.quantity}</span>
                            <span className="font-black text-amber-500">{item.price * item.quantity} د.م</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-600 hover:text-red-500 self-center p-2 rounded-xl hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {cart.length > 0 && (
                  <div className="mt-10 pt-10 border-t border-slate-800 space-y-5">
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>المجموع الجزئي</span>
                      <span>{totalAmount} د.م</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>مصاريف التوصيل</span>
                      <span className="text-emerald-500">مجاني (0.00 د.م)</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-slate-100 pt-5 border-t border-slate-800">
                      <span>الإجمالي النهائي</span>
                      <span className="text-amber-500">{totalAmount} د.م</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Form - Dark Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-slate-900 rounded-[32px] shadow-2xl border border-slate-800 p-8 md:p-10">
              <h2 className="text-2xl font-black text-slate-100 mb-8 flex items-center gap-3">
                  معلومات التوصيل
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className="block text-xs font-black text-slate-500 mb-2 mr-1 flex items-center gap-2 group-focus-within:text-amber-500 transition-colors">
                            <User className="w-4 h-4" /> الاسم الكامل
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder-slate-700"
                            placeholder="محمد العلوي"
                        />
                    </div>

                    <div className="relative group">
                        <label className="block text-xs font-black text-slate-500 mb-2 mr-1 flex items-center gap-2 group-focus-within:text-amber-500 transition-colors">
                            <Phone className="w-4 h-4" /> رقم الهاتف
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder-slate-700 font-mono"
                            placeholder="0600000000"
                        />
                    </div>
                </div>

                <div className="relative group">
                    <label className="block text-xs font-black text-slate-500 mb-2 mr-1 flex items-center gap-2 group-focus-within:text-amber-500 transition-colors">
                        <MapPin className="w-4 h-4" /> المدينة
                    </label>
                    <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder-slate-700"
                        placeholder="الدار البيضاء، الرباط، طنجة..."
                    />
                </div>
                
                <div className="relative group">
                  <label className="block text-xs font-black text-slate-500 mb-2 mr-1 flex items-center gap-2 group-focus-within:text-amber-500 transition-colors">
                      العنوان بالتفصيل
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder-slate-700 resize-none"
                    placeholder="اسم الشارع، رقم المنزل، الطابق..."
                  />
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
                  <div className="p-2 bg-amber-500/10 rounded-lg"><AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" /></div>
                  <p className="text-sm text-slate-400 leading-relaxed font-bold">
                    <span className="text-amber-500 block mb-1">دفع نقداً عند الاستلام (COD)</span>
                    خدمة الدفع متوفرة بعد استلام الطلب. يرجى إبقاء هاتفك متاحاً لتلقي اتصال تأكيد الطلب من فريقنا.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all transform active:scale-95
                    ${isSubmitting || cart.length === 0 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-amber-500/20 hover:-translate-y-1'
                    }
                  `}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الشراء الآن'}
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