import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, Category, Product } from '../types/ecommerce';
import { LocalStoreManager } from '../utils/localStoreFallback';

interface StoreContextType {
  settings: SiteSettings | null;
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  refreshSettings: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(() => LocalStoreManager.getSettings());
  const [categories, setCategories] = useState<Category[]>(() => LocalStoreManager.getCategories());
  const [products, setProducts] = useState<Product[]>(() => LocalStoreManager.getProducts());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setSettings(data);
        LocalStoreManager.saveSettings(data);
        return;
      }
    } catch {
      // fallback
    }
    setSettings(LocalStoreManager.getSettings());
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setCategories(data);
        LocalStoreManager.saveCategories(data);
        return;
      }
    } catch {
      // fallback
    }
    setCategories(LocalStoreManager.getCategories());
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setProducts(data);
        LocalStoreManager.saveProducts(data);
        return;
      }
    } catch {
      // fallback
    }
    setProducts(LocalStoreManager.getProducts());
  };

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      await Promise.all([refreshSettings(), refreshCategories(), refreshProducts()]);
      setIsLoading(false);
    }
    loadInitialData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        products,
        isLoading,
        language,
        setLanguage,
        refreshSettings,
        refreshProducts,
        refreshCategories
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
