import React, { useState } from 'react';
import { ProductItem, CartItem, UPAZILA_ZONES, CustomerOrder } from '../data/storeData';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Ticket, ShoppingBag, Truck, MapPin, Printer } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedUpazila: string;
  onPlaceOrder: (order: CustomerOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedUpazila,
  onPlaceOrder,
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [includeEcoBag, setIncludeEcoBag] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [altPhone, setAltPhone] = useState<string>('');
  const [checkoutUpazila, setCheckoutUpazila] = useState<string>(selectedUpazila);
  const [unionArea, setUnionArea] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [deliverySlot, setDeliverySlot] = useState<string>('morning');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  const currentZone = UPAZILA_ZONES.find((z) => z.id === checkoutUpazila) || UPAZILA_ZONES[0];

  // Financial calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const ecoBagPrice = includeEcoBag ? 25 : 0;
  const isFreeDelivery = subtotal >= currentZone.freeThreshold;
  const deliveryCharge = subtotal === 0 ? 0 : isFreeDelivery ? 0 : currentZone.charge;
  const grandTotal = Math.max(0, subtotal + ecoBagPrice + deliveryCharge - discountAmount);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'HRIDOY50' || couponCode.trim().toUpperCase() === 'GREEN50') {
      if (subtotal < 300) {
        setCouponError('Minimum order of ৳300 required for this coupon');
        return;
      }
      setDiscountAmount(50);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "HRIDOY50"');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !unionArea) {
      alert('Please fill in all delivery details');
      return;
    }

    const orderNum = `HG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      phone,
      altPhone,
      upazila: currentZone.name,
      area: unionArea,
      address,
      items: cartItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        unit: item.product.unit,
      })),
      subtotal,
      deliveryFee: deliveryCharge,
      discount: discountAmount,
      grandTotal,
      paymentMethod: 'cod',
      paymentStatus: 'pending_collection',
      deliveryStatus: 'pending',
      orderSource: 'website',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
      deliveryTimeSlot: deliverySlot === 'morning' ? '8:00 AM - 10:00 AM' : deliverySlot === 'noon' ? '12:00 PM - 2:00 PM' : '4:00 PM - 7:00 PM',
      notes: orderNotes,
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  if (!isOpen && !isCheckoutModalOpen) return null;

  return (
    <>
      {/* Slide-Over Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Drawer Header (Matching "Review Your Harvest 🥕" design) */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-gray-900 flex items-center gap-2">
                    Review Your Harvest 🥕
                  </h3>
                  <p className="text-xs text-gray-500">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Your Harvest Bag is Empty</h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Add fresh organic vegetables, farm eggs, and pantry groceries from our store.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-3 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Free Delivery Meter */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs">
                      {isFreeDelivery ? (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You qualify for FREE Delivery across {currentZone.name}!</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-emerald-900">
                            <span>Add <strong>৳{currentZone.freeThreshold - subtotal}</strong> more for Free Delivery</span>
                            <span className="font-mono font-bold">৳{subtotal} / ৳{currentZone.freeThreshold}</span>
                          </div>
                          <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (subtotal / currentZone.freeThreshold) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-3">
                      {cartItems.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg bg-white shrink-0 border border-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-gray-900 truncate">{product.name}</h5>
                            <span className="text-[11px] text-gray-500 block">{product.weightLabel}</span>
                            <span className="text-xs font-mono font-bold text-emerald-800">
                              ৳{product.price * quantity}
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 font-mono text-xs">
                            <button
                              onClick={() => onUpdateQuantity(product.id, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-gray-300 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add-On: Reusable Eco Bag (Matching screenshot) */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeEcoBag}
                        onChange={(e) => setIncludeEcoBag(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div className="text-xs flex-1">
                        <span className="font-bold text-gray-900 block">Add Reusable Eco Jute Bag</span>
                        <span className="text-[11px] text-gray-500">100% natural, biodegradable (+৳25)</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-emerald-800">+৳25</span>
                    </label>

                    {/* Coupon Code Input */}
                    <div className="pt-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Enter coupon (e.g. HRIDOY50)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={couponApplied}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 uppercase font-mono focus:outline-none focus:bg-white"
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          disabled={couponApplied || !couponCode}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs disabled:opacity-50"
                        >
                          {couponApplied ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                          Coupon HRIDOY50 applied! ৳50 discount deducted.
                        </p>
                      )}
                      {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Order Summary & Checkout Action */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {includeEcoBag && (
                      <div className="flex justify-between text-gray-600">
                        <span>Reusable Eco Bag</span>
                        <span>৳25.00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee ({currentZone.name})</span>
                      <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : ''}>
                        {isFreeDelivery ? 'FREE' : `৳${deliveryCharge.toFixed(2)}`}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Coupon Discount</span>
                        <span>-৳{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Payable</span>
                      <span className="text-emerald-800 text-base">৳{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      setIsCheckoutModalOpen(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[10px] text-gray-400">
                    Cash on Delivery (COD) · Inspect goods before payment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL GUEST CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            {!confirmedOrder ? (
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif text-gray-900">
                    Complete Your Delivery Details
                  </h3>
                  <p className="text-xs text-gray-500">
                    No account required · Guest checkout with Cash on Delivery (COD)
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanjimul Hasan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Phone (for Courier) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Select Upazila / Thana *</label>
                      <select
                        value={checkoutUpazila}
                        onChange={(e) => setCheckoutUpazila(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold"
                      >
                        {UPAZILA_ZONES.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name} (Delivery ৳{z.charge})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Union / Ward / Area *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Joleshwartola / Mokamtola"
                        value={unionArea}
                        onChange={(e) => setUnionArea(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Street Address & Landmark *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Holding number, road number, near mosque or school..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* Delivery Time Slot */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">Preferred Delivery Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliverySlot('morning')}
                        className={`p-2 rounded-xl text-center border font-medium ${
                          deliverySlot === 'morning'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        Morning (8-10 AM)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverySlot('noon')}
                        className={`p-2 rounded-xl text-center border font-medium ${
                          deliverySlot === 'noon'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        Noon (12-2 PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverySlot('evening')}
                        className={`p-2 rounded-xl text-center border font-medium ${
                          deliverySlot === 'evening'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        Evening (4-7 PM)
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                    <span className="font-bold text-gray-900 block text-xs">Payment Method:</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-500 text-emerald-950 font-bold text-xs shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </div>
                      <span className="text-gray-400 text-[11px]">(Pay cash to rider after inspection)</span>
                    </div>
                  </div>
                </div>

                {/* Grand Total Bar & Submit */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Total Payable</span>
                    <span className="text-xl font-bold font-mono text-emerald-900">৳{grandTotal.toFixed(2)}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    Confirm Order (অর্ডার নিশ্চিত করুন)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Order Confirmation Success State */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Order Received Successfully!
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-gray-900">{confirmedOrder.orderNumber}</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Thank you, {confirmedOrder.customerName}. Your farm-fresh harvest is being picked from our depot
                    and scheduled for delivery to {confirmedOrder.address}.
                  </p>
                </div>

                {/* Order Summary Receipt Box */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs font-mono text-left space-y-2">
                  <div className="flex justify-between text-gray-500 text-[11px] pb-2 border-b border-gray-200">
                    <span>Delivery Slot: {confirmedOrder.deliveryTimeSlot}</span>
                    <span>Payment: Cash on Delivery (COD)</span>
                  </div>
                  <div className="space-y-1">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}× {item.productName}</span>
                        <span>৳{item.quantity * item.unitPrice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                    <span>Total Amount to Pay</span>
                    <span className="text-emerald-800">৳{confirmedOrder.grandTotal}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      setConfirmedOrder(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
                  >
                    Back to Store
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
