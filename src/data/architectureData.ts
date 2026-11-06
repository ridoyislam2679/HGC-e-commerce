export interface DirectoryNode {
  name: string;
  type: 'folder' | 'file';
  description: string;
  children?: DirectoryNode[];
}

export const CORE_PHP_DIRECTORY_TREE: DirectoryNode = {
  name: 'grocery-erp',
  type: 'folder',
  description: 'Application root directory for Core PHP ERP',
  children: [
    {
      name: 'app',
      type: 'folder',
      description: 'Core application codebase (PSR-4 style autoloading, OOP, zero frameworks)',
      children: [
        {
          name: 'Config',
          type: 'folder',
          description: 'Environment and system configurations',
          children: [
            { name: 'app.php', type: 'file', description: 'Application constants, timezone (Asia/Dhaka), locale, app URL' },
            { name: 'database.php', type: 'file', description: 'PDO connection credentials from environment variables' },
          ],
        },
        {
          name: 'Core',
          type: 'folder',
          description: 'Framework-free architectural foundation classes',
          children: [
            { name: 'Database.php', type: 'file', description: 'PDO Singleton with prepared statements & MySQL transaction manager' },
            { name: 'Router.php', type: 'file', description: 'Clean URL regex dispatcher supporting GET, POST, PUT, DELETE with route parameters' },
            { name: 'Controller.php', type: 'file', description: 'Base controller providing view rendering, JSON output, and CSRF check' },
            { name: 'Model.php', type: 'file', description: 'Base active model query builder with strict prepared statement binding' },
            { name: 'Request.php', type: 'file', description: 'Input sanitization, file uploads inspection, and HTTP method detection' },
            { name: 'Response.php', type: 'file', description: 'HTTP headers, JSON payload formatting, status codes, and redirects' },
            { name: 'Session.php', type: 'file', description: 'Secure session engine with ID regeneration and flash notifications' },
            { name: 'Auth.php', type: 'file', description: 'Password verification, session state, and RBAC authorization guards' },
            { name: 'Validator.php', type: 'file', description: 'Input validation (required, bd_phone, email, numeric, min, max)' },
            { name: 'CSRF.php', type: 'file', description: 'Cryptographic CSRF token generation & validation middleware' },
          ],
        },
        {
          name: 'Middleware',
          type: 'folder',
          description: 'Route interception guards',
          children: [
            { name: 'AuthMiddleware.php', type: 'file', description: 'Redirects guests to login page' },
            { name: 'RoleMiddleware.php', type: 'file', description: 'Enforces role permissions (Admin, Manager, Accountant, etc.)' },
            { name: 'ApiAuthMiddleware.php', type: 'file', description: 'Validates SHA-256 Bearer tokens for mobile API requests' },
          ],
        },
        {
          name: 'Services',
          type: 'folder',
          description: 'Pure business logic services (No raw SQL or HTML presentation)',
          children: [
            { name: 'CostingService.php', type: 'file', description: 'Calculates landed cost and re-allocates sorting loss to sellable stock' },
            { name: 'InventoryService.php', type: 'file', description: 'Stock movement auditing, batch picking (FIFO/FEFO), reservations' },
            { name: 'AccountingService.php', type: 'file', description: 'Double-entry engine enforcing balanced Debit = Credit journal entries' },
            { name: 'CashHandoverService.php', type: 'file', description: 'Delivery Man -> Admin -> Manager 3-stage cash verification pipeline' },
            { name: 'CommissionService.php', type: 'file', description: 'Delivery rep fixed salary + delivery bonus + direct sales marketing commission' },
            { name: 'InvestorService.php', type: 'file', description: 'Loan amortization vs Mudharabah profit-sharing calculations' },
          ],
        },
        {
          name: 'Controllers',
          type: 'folder',
          description: 'HTTP request handlers',
          children: [
            { name: 'Web', type: 'folder', description: 'Public e-commerce storefront controllers (Home, Cart, Checkout)' },
            { name: 'Admin', type: 'folder', description: 'ERP management controllers (Purchases, Inventory, Accounts, HR)' },
            { name: 'Delivery', type: 'folder', description: 'Delivery representative web portal & direct order form' },
            { name: 'Api/V1', type: 'folder', description: 'Stateless REST API endpoints for Android mobile application' },
          ],
        },
        {
          name: 'Helpers',
          type: 'folder',
          description: 'Global utility functions',
          children: [
            { name: 'formatting.php', type: 'file', description: 'format_bdt(৳), format_weight(kg/gm), format_date_dhaka()' },
            { name: 'security.php', type: 'file', description: 'e() XSS output escaping, sanitize_input(), uuid_generate()' },
          ],
        },
      ],
    },
    {
      name: 'database',
      type: 'folder',
      description: 'Database schema, versioned migrations, and seeding scripts',
      children: [
        { name: 'schema.sql', type: 'file', description: 'Master DDL file for all 52 tables with foreign keys and indexes' },
        { name: 'migrate.php', type: 'file', description: 'Native PHP migration runner (creates migrations table and tracks batches)' },
        { name: 'migrations', type: 'folder', description: 'Timestamped SQL migration patches (e.g. 001_initial_schema.sql)' },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      description: 'Document root accessible by Apache web server',
      children: [
        { name: 'index.php', type: 'file', description: 'Single entry point: loads autoloader, initializes environment, dispatches router' },
        { name: '.htaccess', type: 'file', description: 'Apache mod_rewrite routing all clean URLs to index.php' },
        { name: 'assets', type: 'folder', description: 'Bootstrap 5 CSS, JS, Chart.js, Font Awesome, company logo, uploads' },
      ],
    },
    {
      name: 'resources',
      type: 'folder',
      description: 'Presentation templates and partials (Zero business calculations)',
      children: [
        { name: 'views/layouts', type: 'folder', description: 'main.php, admin_layout.php, delivery_layout.php' },
        { name: 'views/frontend', type: 'folder', description: 'home.php, product.php, cart.php, checkout.php, track.php' },
        { name: 'views/admin', type: 'folder', description: 'dashboard.php, purchases.php, sorting.php, accounting.php, reports.php' },
      ],
    },
    {
      name: 'storage',
      type: 'folder',
      description: 'Private file system storage (Excluded from public web access)',
      children: [
        { name: 'logs', type: 'folder', description: 'app.log, error.log, audit.log' },
        { name: 'uploads', type: 'folder', description: 'Product photos, supplier bills, signed agreement PDFs' },
        { name: 'invoices', type: 'folder', description: 'Generated customer and delivery invoice PDFs' },
      ],
    },
    { name: '.env', type: 'file', description: 'Environment credentials (DB_HOST, DB_USER, DB_PASS, APP_ENV)' },
    { name: '.env.example', type: 'file', description: 'Template environment file for developer setup' },
    { name: 'README.md', type: 'file', description: 'Installation and XAMPP developer documentation' },
  ],
};

export interface RbacPermission {
  module: string;
  name: string;
  slug: string;
  superAdmin: boolean;
  admin: boolean;
  manager: boolean;
  warehouseManager: boolean;
  deliveryMan: boolean;
  accountant: boolean;
  investor: boolean;
  customer: boolean;
}

export const RBAC_MATRIX: RbacPermission[] = [
  // Products & Catalog
  { module: 'Catalog', name: 'View Products & Prices', slug: 'products.view', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: true, accountant: true, investor: true, customer: true },
  { module: 'Catalog', name: 'Create & Edit Products', slug: 'products.manage', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Catalog', name: 'Update Retail & Discount Pricing', slug: 'products.pricing', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: false },

  // Procurement & Suppliers
  { module: 'Procurement', name: 'Manage Farmers & Suppliers', slug: 'suppliers.manage', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Procurement', name: 'Create Purchase Orders (PO)', slug: 'po.create', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Procurement', name: 'Approve Procurement Expenses', slug: 'po.approve', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },

  // Warehouse & Fresh Sorting
  { module: 'Warehouse', name: 'Record Digital Scale Intake (GRN)', slug: 'grn.receive', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Warehouse', name: 'Record Sorting Loss & Discards', slug: 'sorting.record', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Warehouse', name: 'Manage Inter-Warehouse Transfers', slug: 'transfers.manage', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Warehouse', name: 'Quarantine & Write-Off Damaged Stock', slug: 'stock.adjust', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: false, accountant: false, investor: false, customer: false },

  // Orders & Fulfillment
  { module: 'Orders', name: 'Place Online Orders (Checkout)', slug: 'orders.place_online', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: true },
  { module: 'Orders', name: 'Field Direct Order Generation', slug: 'orders.field_direct', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: true, accountant: false, investor: false, customer: false },
  { module: 'Orders', name: 'Assign Deliveries & Routes', slug: 'orders.assign', superAdmin: true, admin: true, manager: true, warehouseManager: true, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'Orders', name: 'Update Delivery Status to Delivered', slug: 'orders.deliver', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: true, accountant: false, investor: false, customer: false },

  // Cash Handover & Payments
  { module: 'Payments', name: 'Collect COD Cash from Customer', slug: 'payments.collect_cod', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: true, accountant: false, investor: false, customer: false },
  { module: 'Payments', name: 'Submit Cash Handover to Admin', slug: 'handover.submit', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: true, accountant: false, investor: false, customer: false },
  { module: 'Payments', name: 'Verify & Confirm Depot Cash Inflow', slug: 'handover.verify', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },

  // Accounting & Finance
  { module: 'Accounting', name: 'View General Ledger & Journal Entries', slug: 'gl.view', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },
  { module: 'Accounting', name: 'Post Journal & Reversal Entries', slug: 'gl.post', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },
  { module: 'Accounting', name: 'Record Operating Expenses', slug: 'expenses.record', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },
  { module: 'Accounting', name: 'Generate P&L and Balance Sheet', slug: 'reports.financial', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: true, investor: true, customer: false },

  // Investors & Loans
  { module: 'Investors', name: 'Manage Loans & Profit-Sharing Deals', slug: 'investors.manage', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },
  { module: 'Investors', name: 'View Own Capital & Profit Statements', slug: 'investors.view_own', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: false, accountant: true, investor: true, customer: false },

  // HR & Payroll
  { module: 'HR', name: 'Log Staff Attendance & Leaves', slug: 'hr.attendance', superAdmin: true, admin: true, manager: true, warehouseManager: false, deliveryMan: false, accountant: false, investor: false, customer: false },
  { module: 'HR', name: 'Calculate & Approve Monthly Payroll', slug: 'hr.payroll', superAdmin: true, admin: true, manager: false, warehouseManager: false, deliveryMan: false, accountant: true, investor: false, customer: false },
];

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  authRequired: boolean;
  roles: string[];
  summary: string;
  requestSample?: string;
  responseSample: string;
}

export const ANDROID_API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    authRequired: false,
    roles: ['All Users'],
    summary: 'Authenticate delivery man or customer and return SHA-256 Bearer Token',
    requestSample: '{\n  "phone": "01711000000",\n  "password": "SecretPassword@123",\n  "device_name": "Redmi Note 12"\n}',
    responseSample: '{\n  "success": true,\n  "token": "amar_bazar_98a7fbc20412354e...",\n  "user": {\n    "id": 14,\n    "name": "Kamal Hossain",\n    "phone": "01711000000",\n    "role": "delivery_man"\n  }\n}',
  },
  {
    method: 'GET',
    path: '/api/v1/products',
    authRequired: false,
    roles: ['Customer', 'Delivery Man'],
    summary: 'Retrieve product catalog with category filter, search query, and real-time stock',
    responseSample: '{\n  "success": true,\n  "data": [\n    {\n      "id": 101,\n      "name": "বগুড়ার আলু (Potato)",\n      "regular_price": 30.00,\n      "unit": "kg",\n      "is_available": true,\n      "stock_qty": 48.00\n    }\n  ]\n}',
  },
  {
    method: 'GET',
    path: '/api/v1/delivery/assigned-orders',
    authRequired: true,
    roles: ['delivery_man'],
    summary: 'List today assigned orders with delivery addresses, phone, items, and COD amount',
    responseSample: '{\n  "success": true,\n  "orders": [\n    {\n      "order_number": "ORD-2026-0045",\n      "customer_name": "Rafiqul Islam",\n      "phone": "01812345678",\n      "address": "Village: Bagbari, Upazila: Sadar",\n      "grand_total": 850.00,\n      "payment_status": "pending_collection",\n      "delivery_status": "out_for_delivery"\n    }\n  ]\n}',
  },
  {
    method: 'POST',
    path: '/api/v1/delivery/orders/direct',
    authRequired: true,
    roles: ['delivery_man'],
    summary: 'Create field direct order generated by delivery man during customer visits',
    requestSample: '{\n  "customer_name": "Mrs. Nasrin Akter",\n  "phone": "01987654321",\n  "upazila": "Sadar",\n  "area": "Hospital Road",\n  "address": "Holding 42, Ward 3",\n  "items": [\n    {"product_id": 101, "quantity": 5.0, "unit_price": 30.00}\n  ],\n  "delivery_charge": 40.00,\n  "notes": "Deliver by 4 PM"\n}',
    responseSample: '{\n  "success": true,\n  "order_id": 892,\n  "order_number": "ORD-2026-0092",\n  "order_source": "delivery_man",\n  "delivery_man_id": 14,\n  "grand_total": 190.00,\n  "commission_earned_est": 3.80\n}',
  },
  {
    method: 'POST',
    path: '/api/v1/delivery/orders/{id}/status',
    authRequired: true,
    roles: ['delivery_man'],
    summary: 'Update order fulfillment status to delivered or failed delivery',
    requestSample: '{\n  "status": "delivered",\n  "cash_collected": 850.00,\n  "customer_signature_token": "sig_confirmed_892"\n}',
    responseSample: '{\n  "success": true,\n  "message": "Order marked DELIVERED. Cash in hand balance increased to ৳2,450.00.",\n  "commission_earned": 15.00\n}',
  },
  {
    method: 'GET',
    path: '/api/v1/delivery/cash-summary',
    authRequired: true,
    roles: ['delivery_man'],
    summary: 'Summary of unremitted cash-in-hand, pending handovers, and monthly commissions',
    responseSample: '{\n  "success": true,\n  "unremitted_cash": 3200.00,\n  "completed_today": 12,\n  "monthly_deliveries": 184,\n  "total_commissions_earned": 3240.00,\n  "base_salary": 12000.00\n}',
  },
];

export interface RoadmapPhase {
  phase: number;
  title: string;
  scope: string;
  keyFiles: string[];
  databaseChanges: string;
  testingVerification: string;
}

export const IMPLEMENTATION_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Phase 1: Foundation & Core MVC Architecture',
    scope: 'Implement single entry point public/index.php, Core Router, PDO Singleton Database, Session Auth, CSRF protection, and base controllers.',
    keyFiles: ['app/Core/Database.php', 'app/Core/Router.php', 'app/Core/Auth.php', 'public/index.php', 'public/.htaccess'],
    databaseChanges: 'Creates users, roles, permissions, role_permissions, user_roles, api_tokens, login_logs.',
    testingVerification: 'Verify clean routing without framework, test SQL injection immunity via PDO, test session hijacking defense & password_hash.',
  },
  {
    phase: 2,
    title: 'Phase 2: Product Catalog & Supplier Master',
    scope: 'Dynamic hierarchical categories, measurement units with fractional KG, brands, product catalog, farmer/dealer supplier profiles.',
    keyFiles: ['app/Controllers/Admin/ProductController.php', 'app/Controllers/Admin/SupplierController.php', 'app/Models/Product.php'],
    databaseChanges: 'Creates units, brands, categories, products, product_images, suppliers.',
    testingVerification: 'Test category nesting, SKU unique constraints, barcode format, fractional quantity parsing.',
  },
  {
    phase: 3,
    title: 'Phase 3: Procurement, Goods Receipt & Sorting Loss Engine',
    scope: 'Purchase order creation with transportation & coolie costs, digital scale weight entry, sorting loss calculation, and sellable batch lot generation.',
    keyFiles: ['app/Services/CostingService.php', 'app/Controllers/Admin/PurchaseController.php', 'app/Controllers/Admin/SortingController.php'],
    databaseChanges: 'Creates purchase_orders, purchase_items, goods_receipts, goods_receipt_items, product_batches.',
    testingVerification: 'Verify potato example: 50kg purchased with 2kg sorting loss correctly recalculates unit cost basis for 48kg sellable stock without double counting loss.',
  },
  {
    phase: 4,
    title: 'Phase 4: Public E-Commerce Website & Guest Checkout',
    scope: 'Modern, fast grocery storefront with search, category browsing, cart drawer, and guest checkout with Bangladesh Upazila delivery fields.',
    keyFiles: ['app/Controllers/Web/HomeController.php', 'app/Controllers/Web/CartController.php', 'app/Controllers/Web/CheckoutController.php'],
    databaseChanges: 'Creates customers, customer_addresses.',
    testingVerification: 'Verify guest checkout places orders without login, cart does not reduce stock prematurely, coupon code applies discounts properly.',
  },
  {
    phase: 5,
    title: 'Phase 5: Order Processing, Warehouse Picking & Zones',
    scope: 'Order status lifecycle (pending -> confirmed -> packing -> assigned -> delivered), stock reservation at packing stage, and delivery zone rate calculation.',
    keyFiles: ['app/Services/InventoryService.php', 'app/Controllers/Admin/OrderController.php', 'app/Models/Order.php'],
    databaseChanges: 'Creates orders, order_items, order_status_history, delivery_zones, stock_balances, stock_movements.',
    testingVerification: 'Verify stock is reserved and deducted upon packing from oldest batch (FIFO), check order cancellation releases reserved stock.',
  },
  {
    phase: 6,
    title: 'Phase 6: Delivery Representative Portal & Direct Field Orders',
    scope: 'Delivery man dashboard, assigned orders, mobile-friendly doorstep order completion, and field customer acquisition & direct order creation.',
    keyFiles: ['app/Controllers/Delivery/DeliveryDashboardController.php', 'app/Services/CommissionService.php'],
    databaseChanges: 'Creates delivery_man_profiles, delivery_commissions.',
    testingVerification: 'Verify order created by delivery man assigns order_source=delivery_man, awards 2% commission, and disallows unauthorized cost modifications.',
  },
  {
    phase: 7,
    title: 'Phase 7: COD Payment Collection & Three-Tier Cash Handover',
    scope: 'Strict chain of custody: Delivery Man collects cash -> Admin depot verifies -> Manager receives -> Deposit to bank account.',
    keyFiles: ['app/Services/CashHandoverService.php', 'app/Controllers/Admin/CashHandoverController.php'],
    databaseChanges: 'Creates cash_handover_records.',
    testingVerification: 'Test that marking delivered leaves payment as pending_collection until verified handover; ensure physical shortage/surplus is logged.',
  },
  {
    phase: 8,
    title: 'Phase 8: Human Resources, Attendance & Monthly Payroll',
    scope: 'Employee profiles, daily attendance logging, monthly salary calculation with base pay + delivery commissions - penalties.',
    keyFiles: ['app/Controllers/Admin/EmployeeController.php', 'app/Controllers/Admin/PayrollController.php'],
    databaseChanges: 'Creates employees, employee_attendance, employee_salaries.',
    testingVerification: 'Verify salary payslip accurately aggregates delivery commissions and advance deductions before posting to payroll ledger.',
  },
  {
    phase: 9,
    title: 'Phase 9: Double-Entry Accounting & General Ledger',
    scope: 'Chart of accounts, general ledger, immutable journal entries, debit = credit balance enforcement, automated operational expense booking.',
    keyFiles: ['app/Services/AccountingService.php', 'app/Controllers/Admin/AccountingController.php', 'app/Models/JournalEntry.php'],
    databaseChanges: 'Creates chart_of_accounts, journal_entries, journal_entry_lines, expenses.',
    testingVerification: 'Attempt unbalanced entry and assert failure; test that loan repayment reduces liability (2030) rather than operating expenses.',
  },
  {
    phase: 10,
    title: 'Phase 10: Dual Investor Models (Loan Amortization vs Mudharabah)',
    scope: 'Separate Type A Loan liabilities from Type B Mudharabah equity partnerships, profit allocation from realized net earnings, and withdrawal tracking.',
    keyFiles: ['app/Services/InvestorService.php', 'app/Controllers/Admin/InvestorController.php'],
    databaseChanges: 'Creates investors, investor_loans, profit_sharing_investments, investor_transactions.',
    testingVerification: 'Confirm that unrealized stock value is excluded from profit allocation, and principal repayment does not inflate operating expenses.',
  },
  {
    phase: 11,
    title: 'Phase 11: Barcode Generation, Thermal Invoices & Combos',
    scope: 'Printable POS/thermal invoices, product barcode generation, multi-item grocery combos with component stock deductions.',
    keyFiles: ['app/Controllers/Admin/InvoiceController.php', 'app/Controllers/Admin/ComboController.php'],
    databaseChanges: 'Creates combos, combo_items, coupons.',
    testingVerification: 'Verify combo sale deducts inventory from individual constituent items without duplication.',
  },
  {
    phase: 12,
    title: 'Phase 12: Android Mobile REST API (v1)',
    scope: 'Versioned stateless REST API endpoints with SHA-256 Bearer tokens, token expiration, rate limiting, and JSON response consistency.',
    keyFiles: ['app/Controllers/Api/V1/AuthController.php', 'app/Controllers/Api/V1/DeliveryApiController.php', 'routes/api.php'],
    databaseChanges: 'Updates api_tokens with expiration checks and revocations.',
    testingVerification: 'Test mobile login, order status updates, and direct order creation via curl and Postman.',
  },
  {
    phase: 13,
    title: 'Phase 13: Analytics, GA4 / GTM DataLayer & Financial Reports',
    scope: 'Google Tag Manager and GA4 e-commerce events (purchase, add_to_cart), Trial Balance, Profit & Loss Statement, and Balance Sheet generation.',
    keyFiles: ['app/Controllers/Admin/ReportController.php', 'resources/views/components/gtm_datalayer.php'],
    databaseChanges: 'Populates system_settings with GA4 and GTM keys.',
    testingVerification: 'Verify dataLayer syntax on order confirmation; verify Trial Balance debit equals credit across all accounting periods.',
  },
  {
    phase: 14,
    title: 'Phase 14: Security Hardening, Automated Tests & Deployment',
    scope: 'CSRF token enforcement across all forms, SQL injection penetration check, XSS escaping, automated database backup cron, XAMPP and Linux Apache VPS guide.',
    keyFiles: ['scripts/backup.php', 'scripts/run_tests.php', 'README.md'],
    databaseChanges: 'Inserts initial seed roles, chart of accounts, and default admin user.',
    testingVerification: 'Run full test suite: authentication, batch costing, vegetable sorting loss, double-entry balance, and permissions.',
  },
];
