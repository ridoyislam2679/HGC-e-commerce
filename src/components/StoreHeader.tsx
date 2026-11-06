import React from 'react';
import { Search, ShoppingBag, MapPin, Heart, LayoutDashboard, Truck, Warehouse, FileText, ChevronDown, PhoneCall } from 'lucide-react';
import { UPAZILA_ZONES } from '../data/storeData';

interface StoreHeaderProps {
  activePortal: 'store' | 'admin' | 'warehouse' | 'delivery' | 'architecture';
  setActivePortal: (portal: 'store' | 'admin' | 'warehouse' | 'delivery' | 'architecture') => void;
  selectedUpazila: string;
  setSelectedUpazila: (upazila: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  setIsCartOpen: (open: boolean) => void;
  wishlistCount: number;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  activePortal,
  setActivePortal,
  selectedUpazila,
  setSelectedUpazila,
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  setIsCartOpen,
  wishlistCount,
}) => {
  const currentZone = UPAZILA_ZONES.find((z) => z.id === selectedUpazila) || UPAZILA_ZONES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Notification Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between font-sans">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 font-medium text-[11px]">
            100% Farm Fresh
          </span>
          <span className="hidden md:inline">
            Free Delivery on orders over ৳{currentZone.freeThreshold} across {currentZone.name}!
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-200">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            Helpline: <strong className="text-white">+880 1700-000000</strong>
          </span>
          <span className="hidden sm:inline text-emerald-300">Est. Time: {currentZone.estTime}</span>
        </div>
      </div>

      {/* Main Brand & Search Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo & Brand Wordmark */}
          <div
            onClick={() => setActivePortal('store')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <img
              src="/assets/aistudio/Logo_de84f64f.jpg"
              alt="Hridoy Greens & Co."
              className="h-11 w-auto object-contain rounded-lg shadow-sm"
              onError={(e) => {
                // Fallback to local path if needed
                (e.target as HTMLImageElement).src = '/public/assets/aistudio/Logo_de84f64f.jpg';
              }}
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-serif leading-none block">
                Hridoy Greens & Co.
              </span>
              <span className="text-[11px] font-medium text-emerald-700 tracking-wide mt-0.5 block">
                হৃদয় গ্রিনস এন্ড কোং · Farm Fresh & Organic
              </span>
            </div>
          </div>

          {/* Upazila Location Selector */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs shrink-0">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block leading-tight">Delivery Location</span>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="bg-transparent font-bold text-emerald-900 focus:outline-none cursor-pointer text-xs"
              >
                {UPAZILA_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="flex-1 max-w-lg relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search farm fresh vegetables, fruits, dairy, fish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Wishlist & Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors hidden sm:flex"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-gray-900 text-[10px] font-extrabold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-mono">
                {cartTotal > 0 ? `৳${cartTotal.toFixed(0)}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Portal Switcher Bar (Matching all requested views: Store, ERP, Warehouse, Delivery, Architecture) */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActivePortal('store')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'store'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Customer Storefront (ই-কমার্স)
            </button>

            <button
              onClick={() => setActivePortal('admin')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Store ERP Dashboard (ম্যানেজার)
            </button>

            <button
              onClick={() => setActivePortal('warehouse')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'warehouse'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              Warehouse & Sorting (গুদাম ও ওজন)
            </button>

            <button
              onClick={() => setActivePortal('delivery')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'delivery'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Delivery Boy App (ডেলিভারি ম্যান)
            </button>

            <button
              onClick={() => setActivePortal('architecture')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activePortal === 'architecture'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Architecture & 52 Tables (আর্কিটেকচার)
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-3 text-gray-500 text-[11px]">
            <span>Cash on Delivery Available</span>
            <span>·</span>
            <span>Upazila Express 60-90m</span>
          </div>
        </div>
      </div>
    </header>
  );
};
