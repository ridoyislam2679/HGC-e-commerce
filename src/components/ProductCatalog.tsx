import React, { useState } from 'react';
import { ProductItem } from '../data/storeData';
import { Plus, Minus, Star, Heart, Check, ShoppingBag, Eye, Clock, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: ProductItem[];
  cartItems: Record<string, number>;
  onAddToCart: (product: ProductItem) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenQuickView: (product: ProductItem) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onOpenQuickView,
  wishlist,
  onToggleWishlist,
}) => {
  return (
    <div className="space-y-10">
      {/* 3 Promotional Cards Strip (Matching Freshco screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Promo 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 flex flex-col justify-between min-h-[170px] shadow-sm">
          <div className="space-y-1.5 z-10">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Fast Courier</span>
            <h4 className="text-xl font-bold font-serif leading-tight">Free Delivery Over ৳1,000</h4>
            <p className="text-xs text-emerald-100/80">Everyday across all Upazila unions & wards.</p>
          </div>
          <button
            onClick={() => {}}
            className="self-start px-4 py-2 rounded-full bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors mt-3"
          >
            Order Now
          </button>
        </div>

        {/* Promo 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-orange-800 text-white p-6 flex flex-col justify-between min-h-[170px] shadow-sm">
          <div className="space-y-1.5 z-10">
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">Verified Fresh</span>
            <h4 className="text-xl font-bold font-serif leading-tight">Ready To Check Out?</h4>
            <p className="text-xs text-amber-100/80">Inspect weight & quality before paying Cash on Delivery.</p>
          </div>
          <button
            onClick={() => {}}
            className="self-start px-4 py-2 rounded-full bg-white text-orange-950 font-bold text-xs hover:bg-orange-50 transition-colors mt-3"
          >
            Express Checkout
          </button>
        </div>

        {/* Promo 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 to-green-900 text-white p-6 flex flex-col justify-between min-h-[170px] shadow-sm">
          <div className="space-y-1.5 z-10">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Farm to Kitchen</span>
            <h4 className="text-xl font-bold font-serif leading-tight">Special Family Bazar Combos</h4>
            <p className="text-xs text-emerald-100/80">Save up to ৳120 with our curated monthly bundles.</p>
          </div>
          <button
            onClick={() => {}}
            className="self-start px-4 py-2 rounded-full bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors mt-3"
          >
            View Combos
          </button>
        </div>
      </div>

      {/* Today's Flash Deals / Featured Products Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
                Fresh Harvest & Daily Deals
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider">
                TODAY'S SPECIAL
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Organic vegetables, sweet seasonal fruits, farm eggs & pantry essentials
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Offer Ends in: <strong className="text-gray-900">05h : 42m : 18s</strong></span>
          </div>
        </div>

        {/* Products Grid (Matching Freshco 4-column card grid) */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-sm text-gray-500">No products matched your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const qtyInCart = cartItems[product.id] || 0;
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all group relative"
                >
                  {/* Top Badges & Wishlist */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {product.discountPct && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-sm">
                        {product.discountPct}% OFF
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                    {/* Quick View Button */}
                    <button
                      onClick={() => onOpenQuickView(product)}
                      className="absolute inset-x-3 bottom-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-800 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 shadow-sm backdrop-blur-sm"
                    >
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Origin & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-0.5">
                        <span className="truncate max-w-[65%]">{product.origin}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 font-sans">
                        {product.nameBn}
                      </p>
                    </div>

                    {/* Weight & Price & Add to Cart */}
                    <div className="pt-2 border-t border-gray-50">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="text-base sm:text-lg font-bold font-mono text-emerald-800">
                            ৳{product.price}
                          </span>
                          {product.regularPrice > product.price && (
                            <span className="text-xs font-mono text-gray-400 line-through ml-1.5">
                              ৳{product.regularPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {product.weightLabel}
                        </span>
                      </div>

                      {/* Add to Cart or Stepper */}
                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add To Bag
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1 text-emerald-950 font-mono">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-emerald-800 flex items-center justify-center shadow-xs hover:bg-emerald-100 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-2">{qtyInCart} in bag</span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:bg-emerald-700 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
