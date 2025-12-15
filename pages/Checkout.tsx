import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react';
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

    // 1. Send to Google Sheets (if configured)
    if (settings.googleSheetUrl) {
        try {
            // Note: 'no-cors' is needed for Google Apps Script Web Apps usually, 
            // but it means we won't get a readable JSON response. We assume success.
            await fetch(settings.googleSheetUrl, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            console.log("Sent to Google Sheet");
        } catch (error) {
            console.error("Error sending to Google Sheet", error);
        }
    }

    // 2. Fire Tracking Pixels
    trackPurchaseEvent(settings, totalAmount, 'MAD');

    // 3. Complete Process
    setTimeout(() => {
      console.log('Order Submitted Locally:', orderData);
      setIsSubmitting(false);
      setSuccess(true);
      clearCart();
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-6">شكراً لثقتك بنا. سنتصل بك قريباً لتأكيد الطلب وتحديد موعد التوصيل.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">ملخص الطلب</h2>
              </div>
              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">السلة فارغة</p>
                    <button onClick={() => navigate('/products')} className="text-blue-600 font-semibold hover:underline">تسوق الآن</button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <li key={item.id} className="py-4 flex gap-4">
                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-500 text-sm">الكمية: {item.quantity}</span>
                            <span className="font-bold text-blue-900">{item.price * item.quantity} د.م</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {cart.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{totalAmount} د.م</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>التوصيل</span>
                      <span className="text-green-600 font-semibold">مجاني</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3">
                      <span>الإجمالي</span>
                      <span>{totalAmount} د.م</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التوصيل</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="مثال: محمد العلوي"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0600000000"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="الدار البيضاء"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">العنوان (اختياري)</label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="اسم الشارع، رقم المنزل..."
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    الدفع نقداً عند الاستلام. لن يتم طلب أي معلومات بنكية. يرجى التأكد من أن هاتفك مفتوح لتأكيد الطلب.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-4 rounded-lg font-bold text-lg text-white shadow-lg transition-all
                    ${isSubmitting || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 hover:shadow-xl hover:-translate-y-1 text-blue-900'}
                  `}
                >
                  {isSubmitting ? 'جاري الطلب...' : 'تأكيد الطلب الآن'}
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