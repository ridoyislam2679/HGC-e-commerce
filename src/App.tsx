import React, { useState, useMemo } from 'react';
import { StoreHeader } from './components/StoreHeader';
import { StoreHero } from './components/StoreHero';
import { CategoryCarousel } from './components/CategoryCarousel';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ManagerDashboardView } from './components/ManagerDashboardView';
import { WarehouseConsoleView } from './components/WarehouseConsoleView';
import { DeliveryRiderAppView } from './components/DeliveryRiderAppView';

// Architecture Portal Components
import { Navbar } from './components/Navbar';
import { ArchitectureTab } from './components/ArchitectureTab';
import { DatabaseTab } from './components/DatabaseTab';
import { SimulatorsTab } from './components/SimulatorsTab';
import { RbacTab } from './components/RbacTab';
import { ApiTab } from './components/ApiTab';
import { RoadmapTab } from './components/RoadmapTab';
import { DocsTab } from './components/DocsTab';
import { SCHEMA_TABLES } from './data/schemaData';

// Data models
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  ProductItem, 
  CustomerOrder, 
  CartItem, 
  UPAZILA_ZONES 
} from './data/storeData';
import { ShieldCheck, PhoneCall, MapPin, Heart, Truck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & Portal State
  const [activePortal, setActivePortal] = useState<'store' | 'admin' | 'warehouse' | 'delivery' | 'architecture'>('store');
  const [activeArchTab, setActiveArchTab] = useState<string>('architecture');

  // Storefront & Location State
  const [selectedUpazila, setSelectedUpazila] = useState<string>('sadar');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist State
  const [cartMap, setCartMap] = useState<Record<string, number>>({
    'prod-01': 2, // 2kg Bogura Red Potato pre-loaded for instant discovery
    'prod-02': 1, // 1kg Cherry Tomatoes
  });
  const [wishlist, setWishlist] = useState<string[]>(['prod-03', 'prod-06']);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // Live Orders State (Shared across Storefront, ERP Dashboard, and Delivery Boy App)
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);

  // Architecture SQL export helpers
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  // Cart calculations
  const cartItemsList: CartItem[] = useMemo(() => {
    return Object.entries(cartMap)
      .map(([id, qty]) => {
        const product = INITIAL_PRODUCTS.find((p) => p.id === id);
        return product ? { product, quantity: qty } : null;
      })
      .filter((item): item is CartItem => item !== null && item.quantity > 0);
  }, [cartMap]);

  const cartCount = useMemo(() => {
    return Object.values(cartMap).reduce((acc, q) => acc + q, 0);
  }, [cartMap]);

  const cartTotal = useMemo(() => {
    return cartItemsList.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItemsList]);

  // Cart Handlers
  const handleAddToCart = (product: ProductItem, qty = 1) => {
    setCartMap((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + qty,
    }));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartMap((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartMap((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleClearCart = () => {
    setCartMap({});
  };

  // Wishlist Handler
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Order Handlers
  const handlePlaceOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomerOrder['deliveryStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            deliveryStatus: newStatus,
            paymentStatus: newStatus === 'delivered' ? 'paid' : ord.paymentStatus,
          };
        }
        return ord;
      })
    );
  };

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameBn.includes(searchQuery) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Copy SQL handlers for Architecture Portal
  const handleCopyAllSql = () => {
    let sqlContent = `-- Hridoy Greens & Co. Master MySQL 8 Schema\n-- 52 Tables | Strict Foreign Keys | Transactional InnoDB\n\n`;
    SCHEMA_TABLES.forEach((table) => {
      sqlContent += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
      const colDefs = table.columns.map((c) => {
        let def = `  \`${c.name}\` ${c.type} ${c.nullable ? 'NULL' : 'NOT NULL'}`;
        if (c.name === 'id') def += ' AUTO_INCREMENT';
        return def;
      });
      colDefs.push(`  PRIMARY KEY (\`id\`)`);
      sqlContent += colDefs.join(',\n');
      sqlContent += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    });

    navigator.clipboard.writeText(sqlContent);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleCopyTableSql = (tableName: string) => {
    const table = SCHEMA_TABLES.find((t) => t.name === tableName);
    if (!table) return;

    let sql = `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
    const colDefs = table.columns.map((c) => {
      let def = `  \`${c.name}\` ${c.type} ${c.nullable ? 'NULL' : 'NOT NULL'}`;
      if (c.name === 'id') def += ' AUTO_INCREMENT';
      return def;
    });
    colDefs.push(`  PRIMARY KEY (\`id\`)`);
    sql += colDefs.join(',\n');
    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    navigator.clipboard.writeText(sql);
    setCopiedTable(tableName);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  const currentZone = UPAZILA_ZONES.find((z) => z.id === selectedUpazila) || UPAZILA_ZONES[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Global Header with Logo, Upazila Selector, Search, Cart & Portal Switcher */}
      <StoreHeader
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        selectedUpazila={selectedUpazila}
        setSelectedUpazila={setSelectedUpazila}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlist.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: CUSTOMER E-COMMERCE STOREFRONT */}
        {activePortal === 'store' && (
          <div className="space-y-10">
            {/* Organic Green Hero Banner & Trust Pillars */}
            <StoreHero
              onShopNowClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreDealsClick={() => {
                setSelectedCategory('all');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Shop by Category Carousel */}
            <CategoryCarousel
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Promotional Cards, Flash Deals & Product Catalog */}
            <div id="catalog-section">
              <ProductCatalog
                products={filteredProducts}
                cartItems={cartMap}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onOpenQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: STORE MANAGER ERP DASHBOARD (eMart / Store Style) */}
        {activePortal === 'admin' && (
          <ManagerDashboardView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* VIEW 3: WAREHOUSE & SORTING INTAKE (WareVix Style) */}
        {activePortal === 'warehouse' && <WarehouseConsoleView />}

        {/* VIEW 4: DELIVERY BOY MOBILE APP SIMULATOR (6amMart Style) */}
        {activePortal === 'delivery' && (
          <DeliveryRiderAppView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewOrder={(newOrd) => setOrders((prev) => [newOrd, ...prev])}
          />
        )}

        {/* VIEW 5: ENTERPRISE ARCHITECTURE & 52-TABLE SCHEMAS */}
        {activePortal === 'architecture' && (
          <div className="space-y-6">
            <Navbar
              activeTab={activeArchTab}
              setActiveTab={setActiveArchTab}
              onCopyAllSql={handleCopyAllSql}
              sqlCopied={sqlCopied}
            />

            <div>
              {activeArchTab === 'architecture' && <ArchitectureTab />}
              {activeArchTab === 'database' && (
                <DatabaseTab onCopyTableSql={handleCopyTableSql} copiedTable={copiedTable} />
              )}
              {activeArchTab === 'simulators' && <SimulatorsTab />}
              {activeArchTab === 'rbac' && <RbacTab />}
              {activeArchTab === 'api' && <ApiTab />}
              {activeArchTab === 'roadmap' && <RoadmapTab />}
              {activeArchTab === 'docs' && (
                <DocsTab onCopyAllSql={handleCopyAllSql} sqlCopied={sqlCopied} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Slide-Over Cart Drawer & "Review Your Harvest" Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItemsList}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        selectedUpazila={selectedUpazila}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.includes(quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Comprehensive E-Commerce Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Logo_de84f64f.jpg"
                  alt="Hridoy Greens & Co."
                  className="h-10 w-auto object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/public/assets/aistudio/Logo_de84f64f.jpg';
                  }}
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-emerald-950">
                    Hridoy Greens & Co.
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-medium">হৃদয় গ্রিনস এন্ড কোং</span>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed pr-6">
                Bogura's premier fresh organic produce, agricultural aggregation, and grocery supply chain network. 
                Committed to 100% formalin-free food, fair prices for farmers, and doorstep delivery across all Upazilas.
              </p>
              <div className="flex items-center gap-3 pt-1 text-emerald-800 font-semibold">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Helpline: +880 1700-000000 (8 AM - 10 PM)</span>
              </div>
            </div>

            {/* Col 2: Upazila Delivery Coverage */}
            <div className="space-y-3">
              <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Upazila Delivery Hubs
              </h5>
              <ul className="space-y-1.5 text-gray-500">
                <li>Bogura Sadar Central Hub</li>
                <li>Shibganj Agricultural Depot</li>
                <li>Gabtali Cold Storage Unit</li>
                <li>Shajahanpur Express Route</li>
                <li>Sherpur Sub-Hub</li>
                <li>Dhunat & Sariakandi</li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Guarantees */}
            <div className="space-y-3">
              <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Our Guarantee
              </h5>
              <ul className="space-y-1.5 text-gray-500">
                <li>100% Formalin & Carbide Free</li>
                <li>Accurate Digital Scale Weighing</li>
                <li>Instant Return on Doorstep</li>
                <li>Cash on Delivery (COD)</li>
                <li>Zero Middleman Farm Gate</li>
              </ul>
            </div>

            {/* Col 4: Systems & Portals */}
            <div className="space-y-3">
              <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Enterprise Portals
              </h5>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActivePortal('store')} className="hover:text-emerald-700 text-left">
                    Consumer Storefront
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('admin')} className="hover:text-emerald-700 text-left">
                    Store ERP Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('warehouse')} className="hover:text-emerald-700 text-left">
                    Warehouse & Sorting Console
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('delivery')} className="hover:text-emerald-700 text-left">
                    Delivery Rider App Simulator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePortal('architecture')} className="hover:text-emerald-700 text-left">
                    52 MySQL Tables & Architecture
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
            <div>
              © 2026 <strong>Hridoy Greens & Co.</strong> (হৃদয় গ্রিনস এন্ড কোং). All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Return & Refund Policy</span>
              <span>•</span>
              <span className="font-mono text-emerald-700 font-bold">Bangladeshi Taka (৳ BDT)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
