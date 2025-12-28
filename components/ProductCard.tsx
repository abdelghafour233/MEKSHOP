
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
    <div className="bg-[#0a0a0a] rounded-[32px] shadow-2xl overflow-hidden hover:shadow-green-500/10 hover:shadow-3xl transition-all duration-500 flex flex-col h-full border border-white/5 hover:border-green-500/40 group">
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-[#111]">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        {product.oldPrice && (
            <div className="absolute top-4 right-4 bg-green-600 text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                تخفيض {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
        )}
      </Link>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-[10px] text-green-500 font-black mb-3 uppercase tracking-[0.2em]">{product.category}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-white font-black text-xl mb-3 leading-snug hover:text-green-400 transition-colors line-clamp-2">
                {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-gray-500 text-sm line-through font-bold">{product.oldPrice} د.م</span>
            )}
            <span className="text-green-500 font-black text-2xl">{product.price} <span className="text-xs">د.م</span></span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-green-500 text-black p-4 rounded-2xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/10 active:scale-90"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;