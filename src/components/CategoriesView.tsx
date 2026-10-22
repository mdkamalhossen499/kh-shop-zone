import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoriesViewProps {
  onSelectCategory: (catId: string) => void;
  onBack: () => void;
}

export function CategoriesView({ onSelectCategory, onBack }: CategoriesViewProps) {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 font-display">All Product Categories</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Explore our wide range of authentic products across 10 official departments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-white text-3xl font-bold">
                    {cat.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-base font-bold font-display">{cat.name}</h3>
                  {cat.nameBn && <span className="text-xs text-neutral-300 block">{cat.nameBn}</span>}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs">
                <p className="text-neutral-500 line-clamp-1 pr-2">{cat.description}</p>
                <span className="font-semibold text-neutral-900 shrink-0 flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                  <span>{count} items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
