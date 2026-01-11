
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  importProducts: (jsonProducts: string) => boolean;
  deletedIds: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// تم تغيير المفتاح إلى v3 لمسح أي بيانات قديمة عالقة في متصفح المستخدم
const STORAGE_KEY = 'berrima_v3_products';
const DELETED_KEY = 'berrima_v3_deleted_ids';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. تحميل أولي للبيانات
  useEffect(() => {
    const savedDeleted = localStorage.getItem(DELETED_KEY);
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    
    let currentDeleted: string[] = [];
    if (savedDeleted) {
      try {
        currentDeleted = JSON.parse(savedDeleted);
        setDeletedIds(currentDeleted);
      } catch (e) { console.error(e); }
    }

    let finalProducts: Product[] = [];
    
    // أولاً: تحميل المنتجات المحفوظة في المتصفح
    if (savedProducts) {
      try {
        finalProducts = JSON.parse(savedProducts);
      } catch (e) { console.error(e); }
    }

    // ثانياً: دمج المنتجات الافتراضية (التي هي فارغة الآن في constants.ts)
    INITIAL_PRODUCTS.forEach(initProd => {
      const wasDeleted = currentDeleted.includes(initProd.id);
      const existsInSaved = finalProducts.some(p => p.id === initProd.id);
      if (!wasDeleted && !existsInSaved) {
        finalProducts.push(initProd);
      }
    });

    setProducts(finalProducts);
    setIsInitialized(true);
  }, []);

  // 2. مزامنة البيانات مع التخزين المحلي عند أي تغيير
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
    }
  }, [products, deletedIds, isInitialized]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
    setDeletedIds(prev => prev.filter(id => id !== product.id));
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setDeletedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearAllProducts = useCallback(() => {
    if (window.confirm("⚠️ هل تريد حقاً مسح كافة المنتجات؟")) {
      const allIds = products.map(p => p.id);
      setDeletedIds(prev => Array.from(new Set([...prev, ...allIds])));
      setProducts([]);
    }
  }, [products]);

  const importProducts = useCallback((jsonProducts: string): boolean => {
    try {
      const parsed = JSON.parse(jsonProducts);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      const importedIds = itemsToImport.map(p => p.id);
      
      setDeletedIds(prev => prev.filter(id => !importedIds.includes(id)));
      setProducts(prev => {
        const newProducts = [...prev];
        itemsToImport.forEach(p => {
          const index = newProducts.findIndex(existing => existing.id === p.id);
          if (index !== -1) newProducts[index] = p;
          else newProducts.unshift(p);
        });
        return newProducts;
      });
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, clearAllProducts, importProducts, deletedIds }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
