
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  importProducts: (jsonProducts: string) => boolean;
  deletedIds: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // 1. تحميل قائمة المعرفات المحذوفة والمنتجات عند البداية
  useEffect(() => {
    const savedDeleted = localStorage.getItem('berrima_deleted_ids');
    const savedProducts = localStorage.getItem('souqMaghrebProducts');
    
    let currentDeleted: string[] = [];
    if (savedDeleted) {
      try { currentDeleted = JSON.parse(savedDeleted); setDeletedIds(currentDeleted); } catch (e) { console.error(e); }
    }

    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        // ندمج المنتجات المحفوظة مع الافتراضية مع استثناء أي ID موجود في قائمة المحذوفات
        const merged = [...parsed];
        INITIAL_PRODUCTS.forEach(initial => {
          const isDeleted = currentDeleted.includes(initial.id);
          const alreadyExists = merged.find(p => p.id === initial.id);
          if (!isDeleted && !alreadyExists) {
            merged.push(initial);
          }
        });
        setProducts(merged);
      } catch (e) {
        setProducts(INITIAL_PRODUCTS.filter(p => !currentDeleted.includes(p.id)));
      }
    } else {
      setProducts(INITIAL_PRODUCTS.filter(p => !currentDeleted.includes(p.id)));
    }
  }, []);

  // 2. حفظ البيانات عند التغيير
  useEffect(() => {
    localStorage.setItem('souqMaghrebProducts', JSON.stringify(products));
    localStorage.setItem('berrima_deleted_ids', JSON.stringify(deletedIds));
  }, [products, deletedIds]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    // إذا كان المنتج قد حذف سابقاً وأعدنا إضافته، نزيله من قائمة المحذوفات
    setDeletedIds(prev => prev.filter(id => id !== product.id));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => 
      prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const deleteProduct = (id: string) => {
    setDeletedIds(prev => [...prev, id]);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const importProducts = (jsonProducts: string): boolean => {
    try {
      const parsed = JSON.parse(jsonProducts);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      
      setProducts(prev => {
        const newProducts = [...prev];
        itemsToImport.forEach(p => {
          const index = newProducts.findIndex(existing => existing.id === p.id);
          if (index !== -1) {
            newProducts[index] = p;
          } else {
            newProducts.unshift(p);
          }
        });
        return newProducts;
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, importProducts, deletedIds }}>
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
