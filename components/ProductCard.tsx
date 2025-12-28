import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart(product);
  };

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-blue-900/10 hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-800 hover:border-blue-500/30 group">
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {product.oldPrice && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                تخفيض {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-[10px] text-blue-400 font-black mb-2 uppercase tracking-[0.2em]">{product.category}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-slate-100 font-bold text-lg mb-3 leading-tight hover:text-amber-500 transition-colors line-clamp-2">
                {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-slate-500 text-sm line-through ml-1 font-bold">{product.oldPrice} د.م</span>
            )}
            <span className="text-amber-500 font-black text-2xl">{product.price} <span className="text-xs">د.م</span></span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-amber-500 hover:text-blue-950 transition-all shadow-lg active:scale-95"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;