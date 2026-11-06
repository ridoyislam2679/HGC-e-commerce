import React, { useState } from 'react';
import { ProductItem } from '../data/storeData';
import { X, Star, Heart, CheckCircle2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Product Image preview */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPct && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm">
                {product.discountPct}% OFF
              </span>
            )}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white shadow-sm transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold mb-1">
                <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full">{product.origin}</span>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1 text-amber-500 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating} (128 reviews)</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-emerald-900 font-semibold font-sans mt-0.5">
                {product.nameBn}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Price block */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold font-mono text-emerald-800">
                  ৳{product.price}
                </span>
                {product.regularPrice > product.price && (
                  <span className="text-xs font-mono text-gray-400 line-through ml-2">
                    ৳{product.regularPrice}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                {product.weightLabel}
              </span>
            </div>

            {/* Quantity Stepper & Add Button */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-white font-mono text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Add To Bag (৳{product.price * quantity})
              </button>
            </div>

            {/* Guarantee badges */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Upazila Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hassle-Free Return on Doorstep</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
