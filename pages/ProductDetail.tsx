import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingCart, Truck, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المنتج غير موجود</h2>
          <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  const handleOrderNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery (Simplified to single image for now) */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                    <Truck className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs font-semibold block text-gray-600">توصيل سريع</span>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                    <CheckCircle className="mx-auto h-6 w-6 text-green-600 mb-2" />
                    <span className="text-xs font-semibold block text-gray-600">ضمان الجودة</span>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                    <Star className="mx-auto h-6 w-6 text-amber-500 mb-2" />
                    <span className="text-xs font-semibold block text-gray-600">الأكثر طلباً</span>
                 </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-blue-600 font-bold uppercase tracking-wide text-sm mb-2">{product.category}</span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-amber-600">{product.price} درهم</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">{product.oldPrice} درهم</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3">مميزات المنتج:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3 sticky bottom-0 bg-white p-4 shadow-lg lg:shadow-none lg:p-0 border-t lg:border-none z-10">
              <button 
                onClick={handleOrderNow}
                className="w-full bg-amber-500 text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                اضطلب الآن - الدفع عند الاستلام
                <Truck className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-blue-50 text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-2"
              >
                أضف إلى السلة
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;