import React from 'react';
import { ShieldCheck, Scale, Truck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StoreHeroProps {
  onShopNowClick: () => void;
  onExploreDealsClick: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onShopNowClick, onExploreDealsClick }) => {
  return (
    <div className="space-y-6">
      {/* Main Campaign Hero Split (Matching Freshco screenshot design) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
          {/* Left Hero Messaging */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                100% Organic & Farm Fresh Guarantee
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-[1.15] text-white">
                Your Trusted Source for <span className="text-emerald-400">Fresh & Healthy</span> Foods
              </h1>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Direct farm-gate procurement from local farmers in Bangladesh. Inspected, digital scale weighed,
                and delivered to your doorstep within 60–90 minutes with Cash on Delivery.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopNowClick}
                className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                Shop Fresh Harvest
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreDealsClick}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider transition-all border border-white/20 backdrop-blur-sm"
              >
                Today's Best Deals (২০% ছাড়)
              </button>
            </div>

            {/* Trust Pill Badges */}
            <div className="pt-4 border-t border-emerald-800/60 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Formalin & Chemicals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exact Digital Scale Weight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>

          {/* Right Hero Imagery (Harvest Basket) */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_fresh_produce_basket_1793954279081.jpg"
              alt="Farm Fresh Harvest Basket"
              className="w-full h-full object-cover lg:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-950 via-transparent to-transparent opacity-80 lg:opacity-60"></div>
          </div>
        </div>
      </div>

      {/* 4 Feature Value Pillars Strip (Matching screenshot design) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Free Upazila Delivery</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">On orders over ৳1,000</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Digital Scale Precision</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Guaranteed accurate weight</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Direct From Farmers</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Fair price & peak freshness</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Cash on Delivery</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Pay after inspecting goods</p>
          </div>
        </div>
      </div>
    </div>
  );
};
