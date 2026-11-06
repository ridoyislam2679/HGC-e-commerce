import React from 'react';
import { STORE_CATEGORIES } from '../data/storeData';
import { Carrot, Apple, Egg, Fish, ShoppingBag, Flame, Package, Sparkles } from 'lucide-react';

interface CategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Carrot': return <Carrot className="w-5 h-5 text-green-700" />;
      case 'Apple': return <Apple className="w-5 h-5 text-amber-700" />;
      case 'Egg': return <Egg className="w-5 h-5 text-yellow-700" />;
      case 'Fish': return <Fish className="w-5 h-5 text-rose-700" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-blue-700" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-700" />;
      case 'Package': return <Package className="w-5 h-5 text-purple-700" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-gray-900">Shop by Category</h3>
          <p className="text-xs text-gray-500">Explore authentic fresh produce, local dairy, and pantry staples</p>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          View All Items (১২০+)
        </button>
      </div>

      {/* Categories Grid (Matching Freshco circular card layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {STORE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-emerald-50/50 border-gray-100 shadow-sm text-gray-800'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-colors ${
                  isSelected ? 'bg-white/20' : cat.bgColor
                }`}
              >
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="font-bold text-xs truncate max-w-full leading-tight">
                {cat.name}
              </span>
              <span
                className={`text-[10px] mt-0.5 font-medium truncate ${
                  isSelected ? 'text-emerald-100' : 'text-gray-400'
                }`}
              >
                {cat.nameBn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
