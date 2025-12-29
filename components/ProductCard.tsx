
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ShareButtons from './ShareButtons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };

  const productUrl = `${window.location.origin}/#/products/${product.id}`;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-lg dark:shadow-2xl overflow-hidden hover:shadow-green-500/20 dark:hover:shadow-green-500/10 transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-white/5 hover:border-green-500/40 group relative">
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-[#111]">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 opacity-95 group-hover:opacity-100"
        />
        {product.oldPrice && (
            <div className="absolute top-4 right-4 bg-green-600 text-white dark:text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                تخفيض {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-[10px] text-green-600 dark:text-green-500 font-black mb-1 uppercase tracking-[0.2em]">{product.category}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-slate-900 dark:text-white font-black text-base mb-2 leading-snug hover:text-green-500 transition-colors line-clamp-2">
                {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-3 mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-slate-400 dark:text-gray-500 text-[10px] line-through font-bold">{product.oldPrice} د.م</span>
            )}
            <span className="text-green-600 dark:text-green-500 font-black text-xl">{product.price} <span className="text-[10px]">د.م</span></span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-green-600 dark:bg-green-500 text-white dark:text-black p-3 rounded-xl hover:bg-green-500 dark:hover:bg-green-400 transition-all shadow-lg active:scale-90"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 -mx-5 px-5 py-3">
          <span className="text-[8px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">مشاركة:</span>
          <ShareButtons url={productUrl} title={product.title} image={product.imageUrl} variant="minimal" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
