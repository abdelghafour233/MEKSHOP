
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  importProducts: (jsonProducts: string) => boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from local storage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('souqMaghrebProducts');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        // Merge initial constants with saved products to ensure core products always exist
        const merged = [...parsed];
        INITIAL_PRODUCTS.forEach(initial => {
          if (!merged.find(p => p.id === initial.id)) {
            merged.push(initial);
          }
        });
        setProducts(merged);
      } catch (e) {
        console.error("Failed to parse products", e);
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  // Save products to local storage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('souqMaghrebProducts', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => 
      prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const importProducts = (jsonProducts: string): boolean => {
    try {
      const parsed = JSON.parse(jsonProducts);
      if (Array.isArray(parsed)) {
        setProducts(prev => {
          const newProducts = [...prev];
          parsed.forEach(p => {
            const index = newProducts.findIndex(existing => existing.id === p.id);
            if (index !== -1) {
              newProducts[index] = p; // Update if exists
            } else {
              newProducts.unshift(p); // Add if new
            }
          });
          return newProducts;
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, importProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
