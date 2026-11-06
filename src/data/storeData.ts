export interface ProductItem {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  subcategory: string;
  price: number;
  regularPrice: number;
  unit: string;
  weightLabel: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isOrganic: boolean;
  isDeal: boolean;
  isPopular: boolean;
  discountPct?: number;
  origin: string;
  image: string;
  description: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  itemCount: number;
  bgColor: string;
  image?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  upazila: string;
  area: string;
  address: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    unit: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'pending_collection' | 'paid' | 'unpaid';
  deliveryStatus: 'pending' | 'processing' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderSource: 'website' | 'delivery_man' | 'phone';
  createdAt: string;
  deliveryTimeSlot: string;
  notes?: string;
  deliveryManId?: string;
}

export const UPAZILA_ZONES = [
  { id: 'sadar', name: 'Bogura Sadar (সদর)', charge: 40, minOrder: 300, freeThreshold: 1000, estTime: '45-60 mins' },
  { id: 'shibganj', name: 'Shibganj (শিবগঞ্জ)', charge: 60, minOrder: 400, freeThreshold: 1200, estTime: '60-90 mins' },
  { id: 'shajahanpur', name: 'Shajahanpur (শাজাহানপুর)', charge: 50, minOrder: 350, freeThreshold: 1000, estTime: '60-80 mins' },
  { id: 'gabtali', name: 'Gabtali (গাবতলী)', charge: 60, minOrder: 400, freeThreshold: 1200, estTime: '75-90 mins' },
  { id: 'sherpur', name: 'Sherpur (শেরপুর)', charge: 70, minOrder: 500, freeThreshold: 1500, estTime: '90-120 mins' },
  { id: 'kahaloo', name: 'Kahaloo (কাহালু)', charge: 65, minOrder: 450, freeThreshold: 1200, estTime: '80-100 mins' },
  { id: 'dhunat', name: 'Dhunat (ধুনট)', charge: 80, minOrder: 500, freeThreshold: 1500, estTime: '90-120 mins' },
];

export const STORE_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Produce', nameBn: 'সকল পণ্য', icon: 'Sparkles', itemCount: 120, bgColor: 'bg-emerald-50 text-emerald-800' },
  { id: 'vegetables', name: 'Fresh Vegetables', nameBn: 'তাজা শাক-সবজি', icon: 'Carrot', itemCount: 45, bgColor: 'bg-green-50 text-green-800', image: '/src/assets/images/category_organic_veggies_1793954278865.jpg' },
  { id: 'fruits', name: 'Fresh Fruits', nameBn: 'টাটকা ফলমূল', icon: 'Apple', itemCount: 32, bgColor: 'bg-amber-50 text-amber-800', image: '/src/assets/images/category_fresh_fruits_1793954279520.jpg' },
  { id: 'dairy', name: 'Dairy & Farm Eggs', nameBn: 'দুধ ও দেশি ডিম', icon: 'Egg', itemCount: 18, bgColor: 'bg-yellow-50 text-yellow-800', image: '/src/assets/images/category_dairy_farm_eggs_1793954280198.jpg' },
  { id: 'meat_fish', name: 'Fish & Farm Meat', nameBn: 'তাজা মাছ ও মাংস', icon: 'Fish', itemCount: 24, bgColor: 'bg-rose-50 text-rose-800' },
  { id: 'grocery', name: 'Grocery Essentials', nameBn: 'নিত্য প্রয়োজনীয় চাল-ডাল', icon: 'ShoppingBag', itemCount: 60, bgColor: 'bg-blue-50 text-blue-800' },
  { id: 'oils_spices', name: 'Pure Oil & Spices', nameBn: 'খাঁটি তেল ও মশলা', icon: 'Flame', itemCount: 28, bgColor: 'bg-orange-50 text-orange-800' },
  { id: 'combos', name: 'Family Bazar Combos', nameBn: 'ফ্যামিলি বাজার কম্বো', icon: 'Package', itemCount: 12, bgColor: 'bg-purple-50 text-purple-800' },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'Bogura Red Potato (বগুড়ার লাল আলু)',
    nameBn: 'বগুড়ার দেশি লাল গোল আলু',
    category: 'vegetables',
    subcategory: 'Root Vegetables',
    price: 32,
    regularPrice: 40,
    unit: 'kg',
    weightLabel: '1 KG',
    stock: 140,
    rating: 4.9,
    reviewsCount: 128,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 20,
    origin: 'Shibganj, Bogura',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Farm-fresh native Bogura red potatoes directly harvested from local agricultural farmers. Naturally firm, nutrient-rich, and free from synthetic preservatives.',
  },
  {
    id: 'prod-02',
    name: 'Ripe Cherry Tomatoes (গাছপাকা টমেটো)',
    nameBn: 'গাছপাকা দেশি লাল টমেটো',
    category: 'vegetables',
    subcategory: 'Salad Produce',
    price: 45,
    regularPrice: 60,
    unit: 'kg',
    weightLabel: '1 KG',
    stock: 85,
    rating: 4.8,
    reviewsCount: 94,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 25,
    origin: 'Mahasthangarh Farm',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally vine-ripened farm-fresh tomatoes with high juice content and deep red coloration. Harvested daily at dawn.',
  },
  {
    id: 'prod-03',
    name: 'Fresh Crisp Broccoli (তাজা ব্রকলি)',
    nameBn: 'অর্গানিক সবুজ ব্রকলি',
    category: 'vegetables',
    subcategory: 'Exotic Greens',
    price: 75,
    regularPrice: 90,
    unit: 'piece',
    weightLabel: '500g Piece',
    stock: 42,
    rating: 4.7,
    reviewsCount: 56,
    isOrganic: true,
    isDeal: false,
    isPopular: true,
    discountPct: 16,
    origin: 'Sadar Eco Farm',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, dense green heads grown with zero harmful chemical pesticides. High in dietary fiber and vitamins C and K.',
  },
  {
    id: 'prod-04',
    name: 'Country Chicken Eggs (দেশি মুরগির ডিম)',
    nameBn: 'খাঁটি দেশি মুরগির তাজা ডিম',
    category: 'dairy',
    subcategory: 'Farm Eggs',
    price: 165,
    regularPrice: 185,
    unit: 'dozen',
    weightLabel: '12 Pieces (Dozen)',
    stock: 90,
    rating: 5.0,
    reviewsCount: 210,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 11,
    origin: 'Gabtali Village Coop',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
    description: 'Genuine pasture-raised free-range country chicken eggs collected directly from rural farmers. Rich amber yolks and high nutrition.',
  },
  {
    id: 'prod-05',
    name: 'Pure Raw Cow Milk (খাঁটি গাভীর তরল দুধ)',
    nameBn: 'খামারের খাঁটি কাঁচা গরুর দুধ',
    category: 'dairy',
    subcategory: 'Dairy',
    price: 85,
    regularPrice: 95,
    unit: 'liter',
    weightLabel: '1 Liter Bottle',
    stock: 60,
    rating: 4.9,
    reviewsCount: 175,
    isOrganic: true,
    isDeal: false,
    isPopular: true,
    discountPct: 10,
    origin: 'Sherpur Dairy Farm',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: '100% unadulterated pure raw cow milk tested for fat content. Zero added water or powder substitutes.',
  },
  {
    id: 'prod-06',
    name: 'Sweet Rajshahi Mango (হিমসাগর আম)',
    nameBn: 'রাজশাহীর রাসায়নিকমুক্ত হিমসাগর আম',
    category: 'fruits',
    subcategory: 'Seasonal Fruits',
    price: 130,
    regularPrice: 160,
    unit: 'kg',
    weightLabel: '1 KG',
    stock: 120,
    rating: 4.9,
    reviewsCount: 312,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 18,
    origin: 'Charghat, Rajshahi',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    description: 'Carbide-free and naturally tree-ripened premium Himsagar mangoes. Unmatched sweetness and rich aromatic pulp.',
  },
  {
    id: 'prod-07',
    name: 'Crisp Green Apple (সবুজ আপেল)',
    nameBn: 'তাজা ক্রিস্পি সবুজ আপেল',
    category: 'fruits',
    subcategory: 'Imported Fruits',
    price: 240,
    regularPrice: 280,
    unit: 'kg',
    weightLabel: '1 KG (approx 5 pcs)',
    stock: 50,
    rating: 4.6,
    reviewsCount: 68,
    isOrganic: false,
    isDeal: false,
    isPopular: false,
    discountPct: 14,
    origin: 'Grade A Import',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy, sweet-tart premium green apples. Ideal for daily snacking, fruit salads, and juicing.',
  },
  {
    id: 'prod-08',
    name: 'Premium Nazirshail Rice (প্রিমিয়াম নাজিরশাইল চাল)',
    nameBn: 'সুগন্ধি সরু নাজিরশাইল চাল (নতুন ধান)',
    category: 'grocery',
    subcategory: 'Rice & Grains',
    price: 82,
    regularPrice: 90,
    unit: 'kg',
    weightLabel: '1 KG',
    stock: 350,
    rating: 4.9,
    reviewsCount: 240,
    isOrganic: true,
    isDeal: false,
    isPopular: true,
    discountPct: 9,
    origin: 'Dinajpur Rice Mill',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Aromatic, slender long-grain Nazirshail rice cleanly sorted and de-stoned. Cooks light, non-sticky, and fluffy.',
  },
  {
    id: 'prod-09',
    name: 'Cold-Pressed Mustard Oil (ঘানিভাঙ্গা সরিষার তেল)',
    nameBn: '১০০% খাঁটি কাঠের ঘানিভাঙ্গা সরিষার তেল',
    category: 'oils_spices',
    subcategory: 'Cooking Oil',
    price: 260,
    regularPrice: 300,
    unit: 'liter',
    weightLabel: '1 Liter PET Bottle',
    stock: 75,
    rating: 5.0,
    reviewsCount: 189,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 13,
    origin: 'Sirajganj Mustard Ghani',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional wood-pressed unfiltered mustard oil with strong natural pungency (ঝাঁঝ). Pure culinary heritage.',
  },
  {
    id: 'prod-10',
    name: 'Fresh Rui Fish (তাজা নদীর রুই মাছ)',
    nameBn: 'যমুনা নদীর তাজা বড় রুই মাছ',
    category: 'meat_fish',
    subcategory: 'Freshwater Fish',
    price: 360,
    regularPrice: 420,
    unit: 'kg',
    weightLabel: '1 KG Whole Fish',
    stock: 35,
    rating: 4.8,
    reviewsCount: 92,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 14,
    origin: 'Jamuna River Catch',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh Jamuna river catch, cleaned and portioned upon request. Never frozen or chemical-preserved.',
  },
  {
    id: 'prod-11',
    name: 'Deshi Dressed Chicken (দেশি চামড়া ছাড়ানো মুরগি)',
    nameBn: 'তাজা প্রক্রিয়াজাত দেশি মুরগি',
    category: 'meat_fish',
    subcategory: 'Poultry',
    price: 480,
    regularPrice: 550,
    unit: 'kg',
    weightLabel: '1 KG Net Cut',
    stock: 25,
    rating: 4.9,
    reviewsCount: 143,
    isOrganic: true,
    isDeal: false,
    isPopular: true,
    discountPct: 12,
    origin: 'Village Free-Range',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    description: 'Halal slaughtered, cleanly dressed deshi farm chicken. Firm meat texture and authentic village flavor.',
  },
  {
    id: 'prod-12',
    name: 'Family Kitchen Combo Pack (মাসিক বাজার কম্বো)',
    nameBn: '৫ কেজি আলু + ৫ কেজি চাল + ১ লি. তেল + ১ ডজন ডিম',
    category: 'combos',
    subcategory: 'Bundle Pack',
    price: 740,
    regularPrice: 860,
    unit: 'box',
    weightLabel: 'Complete 12KG Bundle',
    stock: 20,
    rating: 5.0,
    reviewsCount: 310,
    isOrganic: true,
    isDeal: true,
    isPopular: true,
    discountPct: 14,
    origin: 'Hridoy Greens Bundle',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Essential weekly grocery combo: 5kg Bogura Potato + 5kg Nazirshail Rice + 1L Mustard Oil + 1 Dozen Free-Range Eggs at maximum savings.',
  },
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-1045',
    orderNumber: 'HG-2026-1045',
    customerName: 'Tanjimul Hasan',
    phone: '01712-345678',
    upazila: 'Bogura Sadar',
    area: 'Joleshwartola, Ward 8',
    address: 'House 14, Road 3, Near City College',
    items: [
      { productName: 'Bogura Red Potato', quantity: 3, unitPrice: 32, unit: 'kg' },
      { productName: 'Country Chicken Eggs', quantity: 2, unitPrice: 165, unit: 'dozen' },
      { productName: 'Pure Raw Cow Milk', quantity: 2, unitPrice: 85, unit: 'liter' },
    ],
    subtotal: 596,
    deliveryFee: 40,
    discount: 50,
    grandTotal: 586,
    paymentMethod: 'cod',
    paymentStatus: 'pending_collection',
    deliveryStatus: 'out_for_delivery',
    orderSource: 'website',
    createdAt: '2026-11-06 09:30 AM',
    deliveryTimeSlot: '10:00 AM - 12:00 PM',
    deliveryManId: 'rider-01',
  },
  {
    id: 'ord-1044',
    orderNumber: 'HG-2026-1044',
    customerName: 'Begum Rokeya Akter',
    phone: '01819-876543',
    upazila: 'Shibganj',
    area: 'Mokamtola Bazar',
    address: 'Hazi Villa, Holding 82, College Road',
    items: [
      { productName: 'Family Kitchen Combo Pack', quantity: 1, unitPrice: 740, unit: 'box' },
      { productName: 'Fresh Rui Fish', quantity: 2, unitPrice: 360, unit: 'kg' },
    ],
    subtotal: 1460,
    deliveryFee: 0, // Free delivery > 1000
    discount: 0,
    grandTotal: 1460,
    paymentMethod: 'cod',
    paymentStatus: 'pending_collection',
    deliveryStatus: 'processing',
    orderSource: 'website',
    createdAt: '2026-11-06 10:15 AM',
    deliveryTimeSlot: '02:00 PM - 04:00 PM',
  },
  {
    id: 'ord-1043',
    orderNumber: 'HG-2026-1043',
    customerName: 'Md. Shahidul Islam',
    phone: '01911-223344',
    upazila: 'Bogura Sadar',
    area: 'Chakjadu Road',
    address: 'Shop 04, Shahid Market',
    items: [
      { productName: 'Cold-Pressed Mustard Oil', quantity: 3, unitPrice: 260, unit: 'liter' },
      { productName: 'Premium Nazirshail Rice', quantity: 10, unitPrice: 82, unit: 'kg' },
    ],
    subtotal: 1600,
    deliveryFee: 0,
    discount: 50,
    grandTotal: 1550,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    orderSource: 'delivery_man',
    createdAt: '2026-11-06 08:45 AM',
    deliveryTimeSlot: '11:00 AM - 01:00 PM',
    deliveryManId: 'rider-01',
  },
];
