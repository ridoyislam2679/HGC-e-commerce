# MASTER ARCHITECTURAL BLUEPRINT & SPECIFICATION
## AmarBazar Grocery E-commerce, Inventory, Delivery & Business Management ERP
**Platform Architecture:** Core PHP 8.2+ (Pure OOP, Custom MVC, PDO Prepared Statements, MySQL 8 InnoDB, Bootstrap 5)  
**Target Market:** Bangladesh Local Commerce (Starting 1 Upazila, architected for multi-Upazila/multi-warehouse scalability)  
**Timezone:** `Asia/Dhaka` | **Base Currency:** Bangladeshi Taka (BDT, ৳)  
**Framework Policy:** Strictly Zero PHP Frameworks (No Laravel, Symfony, or CodeIgniter). Clean, maintainable OOP code.

---

## 1. PROJECT REQUIREMENTS & OPERATIONAL ANALYSIS
AmarBazar integrates two distinct business realities into a single unified platform:
1. **Perishable Agricultural Supply Chain:** Direct farm-gate procurement from local farmers, weight variations, sorting loss, packaging, grading, and short shelf-life management.
2. **Manufactured Packaged Goods Supply Chain:** Procurement from FMCG distributors and dealers with standard packaging, batch tracking, and MRP control.

### Operational Lifecycle:
```
[ Farmer / Dealer ] 
       ↓ (Purchase Order with Transport + Handling Expenses)
[ Warehouse Receiving & Digital Scale Weight Entry ]
       ↓ (Inspection & Quality Grading)
[ Sorting Loss & Moisture Loss Segregation (Loss is NOT a sale) ]
       ↓ (Effective Landed Cost Allocation to Sellable Stock)
[ Product Batch Creation & Barcode Generation ]
       ↓
[ Multi-Channel Sales: Online Webstore + Delivery Agent Field Sales ]
       ↓ (Backend Stock Reservation → Real-time Stock Deduction on Packing)
[ Delivery Zone Dispatch & Cash-On-Delivery (COD) Execution ]
       ↓
[ Three-Stage Cash Handover: Delivery Agent → Admin → Manager → Bank ]
       ↓
[ Balanced Double-Entry Journal Entry in General Ledger ]
```

---

## 2. CUSTOM CORE PHP MVC ARCHITECTURE
The system is built on a clean, single-entry-point architecture separating concerns cleanly without framework overhead:

```
grocery-erp/
├── app/
│   ├── Config/
│   │   ├── app.php            # App constants, timezone (Asia/Dhaka), URL, environment
│   │   └── database.php       # PDO connection parameters (host, db, user, pass, charset)
│   ├── Core/
│   │   ├── Database.php       # Centralized PDO Singleton with Transaction management
│   │   ├── Router.php         # Clean URL regex dispatcher supporting GET, POST, PUT, DELETE
│   │   ├── Controller.php     # Base controller with view rendering, JSON response, CSRF
│   │   ├── Model.php          # Base active query builder with prepared statements
│   │   ├── Request.php        # Input sanitizer, file uploads, method detection
│   │   ├── Response.php       # Header manager, HTTP status codes, redirects
│   │   ├── Session.php        # Secure session handler with ID regeneration & flash data
│   │   ├── Auth.php           # Session auth, role verification, password hashing
│   │   ├── CSRF.php           # Cryptographic token generator & validator
│   │   └── Validator.php      # Validation engine (required, email, bd_phone, numeric, min, max)
│   ├── Middleware/
│   │   ├── AuthMiddleware.php # Redirects unauthenticated requests to login
│   │   ├── RoleMiddleware.php # Restricts endpoints by user role slug
│   │   └── ApiAuthMiddleware.php # Validates Bearer SHA-256 tokens for mobile endpoints
│   ├── Services/              # Reusable Pure Business Logic (No SQL or HTML here)
│   │   ├── CostingService.php        # Landed cost & sorting loss cost recalculation
│   │   ├── InventoryService.php      # Stock movement auditor, batch allocation, FEFO
│   │   ├── AccountingService.php     # Double-entry balanced journal writer
│   │   ├── CashHandoverService.php   # Multi-tier cash verification pipeline
│   │   ├── CommissionService.php     # Delivery sales & marketing commission engine
│   │   └── InvestorService.php       # Loan vs Mudharabah profit distribution engine
│   ├── Controllers/
│   │   ├── Web/                      # Public e-commerce website controllers
│   │   ├── Admin/                    # Admin ERP controllers
│   │   ├── Delivery/                 # Delivery representative dashboard & field order entry
│   │   └── Api/V1/                   # REST API controllers for Android app
│   └── Helpers/
│       ├── formatting.php     # format_bdt(৳), format_weight(kg/gm), format_date_dhaka()
│       └── security.php       # e() XSS escaper, sanitize_input(), generate_uuid()
├── database/
│   ├── schema.sql             # Complete master DDL
│   ├── migrations/            # Versioned SQL migration files (e.g. 001_initial.sql)
│   └── migrate.php            # Native PHP migration runner
├── public/
│   ├── index.php              # Single Application Entry Point
│   ├── .htaccess              # Apache URL rewriting to index.php
│   └── assets/                # CSS, JS, Vendor, Uploads (strictly non-PHP assets)
├── resources/
│   └── views/                 # PHP Views (pure presentation, zero business math)
│       ├── layouts/           # Main, Admin, Delivery, Minimal
│       ├── frontend/          # Home, Shop, Cart, Checkout, Order Tracking
│       └── admin/             # Dashboard, Products, Purchase, Sorting, Accounting
├── storage/
│   ├── logs/                  # Exception logs, audit trail logs
│   ├── uploads/               # Product photos, receipts, agreement PDFs
│   └── invoices/              # Generated invoice PDFs
├── .env                       # Local secrets (never committed to Git)
└── .env.example
```

---

## 3. INVENTORY & BATCH COSTING METHODOLOGY
Historical purchase prices fluctuate dynamically in agricultural markets. Selling price and gross margin calculations must never rely on static estimates.

### Landed Cost Components:
1. **Base Procurement Cost ($C_{base}$):** Net invoice amount paid to farmer or wholesaler.
2. **Attributed Inbound Freight ($C_{freight}$):** Vehicle hire, fuel, or local transport from farm/market to warehouse.
3. **Handling Expenses ($C_{handling}$):** Labor for loading/unloading (কুলি খরচ).
4. **Packaging & Preparation ($C_{pack}$):** Sacks, crates, nets, poly bags, and labeling.
5. **Other Direct Procurement Expenses ($C_{other}$)**.

$$\text{Total Landed Cost } (TLC) = C_{base} + C_{freight} + C_{handling} + C_{pack} + C_{other}$$

---

## 4. FRESH VEGETABLE WEIGHT & SORTING LOSS CALCULATION ENGINE
Agricultural commodities (potatoes, onions, leafy vegetables, tomatoes) incur immediate moisture shrinkage, cleaning removal, and sorting loss upon arrival.

### Strict Business Rule:
**Sorting loss is NEVER treated as a customer sale or recorded as Cost of Goods Sold (COGS).**  
Instead, sorting loss adjusts the **effective unit cost basis** of the remaining sellable stock, so inventory is carried at actual economic value.

### Mathematical Formulation:
- $W_{purchased}$: Raw weight weighed at source or farm (e.g., $50.00\text{ kg}$)
- $W_{received}$: Physical weight recorded on warehouse digital scale upon arrival (e.g., $49.80\text{ kg}$, $0.20\text{ kg}$ transit moisture loss)
- $W_{rejected}$: Damaged stock returned to supplier or credited (e.g., $0.00\text{ kg}$)
- $W_{sorting\_loss}$: Inedible mud, roots, spoiled leaves, rotten pieces discarded (e.g., $1.80\text{ kg}$)
- $W_{sellable}$: Net prime sellable inventory ready for packaging/retail:
  $$W_{sellable} = W_{received} - W_{rejected} - W_{sorting\_loss} = 49.80 - 0.00 - 1.80 = 48.00\text{ kg}$$

### Effective Cost Basis per Sellable Unit:
If $50.00\text{ kg}$ purchased at ৳$20.00/\text{kg} = ৳1,000.00$ plus ৳$110.00$ inbound transport/sorting costs ($TLC = ৳1,110.00$):
$$\text{Effective Unit Landed Cost} = \frac{TLC - \text{Credit for Rejected}}{W_{sellable}} = \frac{৳1,110.00}{48.00\text{ kg}} = ৳23.125/\text{kg}$$

If retail price is ৳$30.00/\text{kg}$:
- Expected Gross Profit per kg = $৳30.00 - ৳23.125 = ৳6.875/\text{kg}$
- Gross Margin % = $\frac{৳6.875}{৳30.00} \times 100 = 22.92\%$

---

## 5. ORDER PROCESSING & FIELD DELIVERY WORKFLOW
The system supports both customer web checkout and field-level direct order generation by delivery representatives.

### Order Status Lifecycle:
```
1. PENDING: Customer places order online OR Delivery Man creates order in field app.
2. CONFIRMED: Admin/Manager confirms items & verifies customer contact.
3. PROCESSING / PACKING: Warehouse team picks items from specific batches; stock is RESERVED.
4. ASSIGNED: Order assigned to Delivery Man based on geographic Delivery Zone.
5. OUT FOR DELIVERY: Delivery Man departs with package and invoice; stock moves from RESERVED to SOLD.
6. DELIVERED: Customer receives goods; payment status moves to PENDING_COLLECTION.
7. COMPLETED: Physical cash is handed over and verified by Admin/Manager.
```

### Cancellation / Return Rules:
- If order is cancelled before dispatch, reserved stock is released back to available balance.
- If delivery fails at customer doorstep, returned goods are received into quarantine for inspection before restock or write-off.
- Delivery commission is **automatically voided** on cancelled or returned orders.

---

## 6. COD PAYMENT COLLECTION & THREE-TIER CASH HANDOVER PIPELINE
Because Cash on Delivery (COD) carries substantial handling risks in Bangladesh, the system enforces a strict chain of custody:

```
[ Customer ]
     │ (Pays Cash ৳1,500)
     ▼
[ Delivery Agent ]  ──> System State: `payment_status = pending_collection`
     │                  `delivery_man_profiles.current_cash_in_hand += ৳1,500`
     │ (Physically submits cash at depot)
     ▼
[ Admin / Cashier ] ──> Verifies batch & signs off handover code:
     │                  `cash_handover_records` (Stage: delivery_to_admin, Status: verified)
     │                  Delivery agent cash balance cleared.
     │ (Depot settlement)
     ▼
[ General Manager ] ──> Confirms depot aggregate cash & deposits into Corporate Bank / bKash Merchant:
                        `journal_entries`: Dr Cash in Bank (1020), Cr Cash in Hand (1010).
```

---

## 7. DOUBLE-ENTRY ACCOUNTING & CHART OF ACCOUNTS
Accounting is implemented with full debit-credit balance enforcement at database transaction commit.

### Core Chart of Accounts:
- **1000 Assets:**
  - 1010 Cash in Hand (Depot / Admin Vault)
  - 1015 Delivery Man Cash in Hand (In Transit)
  - 1020 Bank Current Account (BRAC Bank / Dutch-Bangla)
  - 1030 Mobile Merchant Wallets (bKash / Nagad)
  - 1050 Inventory Asset - Fresh Vegetables & Fruits
  - 1060 Inventory Asset - Packaged Groceries
  - 1080 Accounts Receivable (B2B / Institution)
- **2000 Liabilities:**
  - 2010 Accounts Payable - Suppliers & Farmers
  - 2030 Investor Loan Principal Liability
  - 2040 Accrued Salaries & Commissions Payable
- **3000 Equity:**
  - 3010 Founder Capital
  - 3020 Investor Profit-Sharing Capital (Mudharabah)
  - 3050 Retained Earnings
- **4000 Revenue:**
  - 4010 Grocery Sales Revenue
  - 4020 Delivery Charge Revenue
- **5000 Cost of Goods Sold (COGS):**
  - 5010 COGS - Fresh Produce
  - 5020 COGS - Packaged Groceries
  - 5050 Inbound Freight & Handling Absorbed
- **6000 Operating Expenses:**
  - 6010 Warehouse Rent
  - 6020 Employee Basic Salaries
  - 6030 Delivery Commissions & Fuel
  - 6040 Packaging Supplies
  - 6050 Electricity & Utilities
  - 6060 Marketing & Promotion

### Golden Accounting Rules Enforced:
1. $\sum \text{Debit} \equiv \sum \text{Credit}$ on every single transaction.
2. Journal entries are append-only. To correct an entry, a formal reversal entry (`is_reversed = 1`) must be posted.
3. **Investor Loan Principal Repayment:** Debit Loan Liability (2030), Credit Bank (1020). **Never charge loan principal repayment as an operating expense.**

---

## 8. DUAL-ENGINE INVESTOR MODELS

### Type A: Loan-Based Financing (Debt)
- Capital provided as an explicit loan with fixed or contractual tenure.
- **Accounting Treatment:**
  - Receipt: Dr Bank (1020) ৳500,000, Cr Investor Loan Liability (2030) ৳500,000.
  - Repayment: Dr Investor Loan Liability (2030) ৳50,000, Cr Bank (1020) ৳50,000.
  - Agreed Financing Charge (if applicable): Dr Financial Financing Expense (6080), Cr Bank (1020).

### Type B: Profit-Sharing Investment (Equity / Mudharabah)
- Investor injects risk capital with an agreed profit-sharing percentage (e.g., $15\%$ of Net Profit).
- **Accounting Treatment:**
  - Inflow: Dr Bank (1020) ৳1,000,000, Cr Investor Capital - Mudharabah (3020) ৳1,000,000.
  - Periodic Profit Allocation (e.g., Net Profit = ৳100,000; 15% share = ৳15,000):
    - Dr Profit Allocation Expense / Retained Earnings, Cr Investor Profit Payable (2050) ৳15,000.
  - Distribution Withdrawal:
    - Dr Investor Profit Payable (2050) ৳15,000, Cr Bank (1020) ৳15,000.
- **Strict Distinction:** Capital withdrawals decrease Investor Equity (3020), while profit distributions clear accrued profit liabilities. Potential unrealized stock profit is strictly barred from distribution.

---

## 9. DELIVERY COMPENSATION & COMMISSION FORMULA
Delivery representatives earn a hybrid salary structure:
$$\text{Total Monthly Payout} = \text{Base Salary} + \sum \text{Delivery Commission} + \sum \text{Marketing Commission} - \text{Penalties}$$
- **Delivery Commission:** Fixed ৳$15.00$ per successfully delivered order.
- **Marketing Commission:** $2.0\%$ of subtotal for customer orders acquired and created directly by the delivery representative in the field.
- **Reversal Condition:** If an order is returned or cancelled after being marked delivered, associated commissions are credited with an audit reversal record.

---

## 10. ANDROID REST API ARCHITECTURE (`/api/v1/`)
All mobile interactions utilize stateless REST endpoints with SHA-256 bearer tokens:
- `POST /api/v1/auth/login`: Phone + Password authentication returning Bearer Token & User Role.
- `GET  /api/v1/products`: Catalog listing with category filter, search query, stock status.
- `GET  /api/v1/delivery/orders`: Orders assigned to authenticated delivery agent.
- `POST /api/v1/delivery/orders/direct`: Direct field order generation with customer info and product basket.
- `POST /api/v1/delivery/orders/{id}/status`: Transition delivery status (e.g. `out_for_delivery` → `delivered`).
- `GET  /api/v1/delivery/handover-summary`: Current unremitted cash-in-hand calculation.

---

## 11. XAMPP LOCAL DEVELOPMENT & PRODUCTION DEPLOYMENT
### XAMPP Setup (Windows 10):
1. Extract project into `C:\xampp\htdocs\grocery-erp\`.
2. Configure Apache VirtualHost in `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
```apache
<VirtualHost *:80>
    ServerName amar-bazar.local
    DocumentRoot "C:/xampp/htdocs/grocery-erp/public"
    <Directory "C:/xampp/htdocs/grocery-erp/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```
3. Add `127.0.0.1 amar-bazar.local` to `C:\Windows\System32\drivers\etc\hosts`.
4. Import `/database/schema.sql` via phpMyAdmin into database `grocery_erp_db`.
5. Copy `.env.example` to `.env` and set `DB_HOST=127.0.0.1`, `DB_NAME=grocery_erp_db`, `DB_USER=root`, `DB_PASS=`.

---

## 12. 14-PHASE DEVELOPMENT ROADMAP
- **Phase 1:** Core Foundation, Router, PDO Singleton, DB Migrations, Session Auth, RBAC.
- **Phase 2:** Product Catalog, Dynamic Hierarchy, Brands, Units, Suppliers.
- **Phase 3:** Procurement, Goods Receipt, Vegetable Weight & Sorting Loss Engine.
- **Phase 4:** Public E-commerce Webstore, Shopping Cart, Guest Checkout.
- **Phase 5:** Order Management, Picking, Packing, Delivery Zone Allocation.
- **Phase 6:** Delivery Agent Field App, Direct Customer Order Generation, Commissions.
- **Phase 7:** Cash Collection, 3-Tier Handover, Reconciliation.
- **Phase 8:** Manager Operations, Employee Attendance, Payroll.
- **Phase 9:** General Ledger, Chart of Accounts, Double-Entry Balanced Journals.
- **Phase 10:** Investor Accounts, Loan Amortization vs Mudharabah Profit-Sharing.
- **Phase 11:** Barcodes, Print Invoices, Combos, Clearance Alerts.
- **Phase 12:** Android REST API v1 & Token Revocation.
- **Phase 13:** GA4 / GTM DataLayer, Financial Statements (P&L, Balance Sheet).
- **Phase 14:** Production Security Hardening, Audit Logs, Backup Automation.
