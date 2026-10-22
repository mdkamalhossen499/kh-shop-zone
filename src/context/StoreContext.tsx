import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, Category, Product } from '../types/ecommerce';

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
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    }
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
