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
    e.preventDefault(); // Prevent navigation if clicking the button
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden group">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                تخفيض {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
        )}
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight hover:text-blue-800 transition-colors line-clamp-2">
                {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-gray-400 text-sm line-through ml-1">{product.oldPrice} د.م</span>
            )}
            <span className="text-amber-600 font-bold text-xl">{product.price} د.م</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-blue-900 text-white p-2 rounded-full hover:bg-amber-500 transition-colors shadow-sm"
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