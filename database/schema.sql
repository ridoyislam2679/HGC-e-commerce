-- ============================================================================
-- AmarBazar Grocery ERP & E-commerce System - Complete MySQL 8 Database Schema
-- Architecture: Core PHP (OOP, PDO, Normalized, Double-Entry, Transactional)
-- Target: XAMPP Local Development & Production Linux VPS / Apache
-- Timezone: Asia/Dhaka | Currency: BDT (৳)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. AUTHENTICATION & ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_phone` (`phone`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `module` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` BIGINT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `api_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL DEFAULT 'android_app',
  `abilities` JSON NULL,
  `last_used_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_api_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `identifier` VARCHAR(191) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` TEXT NULL,
  `status` ENUM('success', 'failed') NOT NULL,
  `failure_reason` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_login_logs_user` (`user_id`),
  INDEX `idx_login_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. CUSTOMERS & ADDRESS BOOK
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `customers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `alt_phone` VARCHAR(20) NULL,
  `email` VARCHAR(191) NULL,
  `district` VARCHAR(100) NOT NULL DEFAULT 'Dhaka',
  `upazila` VARCHAR(100) NOT NULL,
  `union_name` VARCHAR(100) NULL,
  `area` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `is_guest` TINYINT(1) NOT NULL DEFAULT 0,
  `acquired_by_delivery_man_id` BIGINT UNSIGNED NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_customers_phone` (`phone`),
  INDEX `idx_customers_upazila` (`upazila`),
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `customer_addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(50) NOT NULL DEFAULT 'Home',
  `contact_person` VARCHAR(150) NOT NULL,
  `contact_phone` VARCHAR(20) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `upazila` VARCHAR(100) NOT NULL,
  `union_name` VARCHAR(100) NULL,
  `village_area` VARCHAR(150) NOT NULL,
  `street_address` TEXT NOT NULL,
  `delivery_instructions` TEXT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_addr_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. PRODUCT CATALOG, CATEGORIES & UNITS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `units` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `is_fractional` TINYINT(1) NOT NULL DEFAULT 0,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` INT UNSIGNED NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `barcode` VARCHAR(60) NULL UNIQUE,
  `brand_id` INT UNSIGNED NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `unit_id` INT UNSIGNED NOT NULL,
  `weight_value` DECIMAL(10,3) NOT NULL DEFAULT 1.000,
  `origin` VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
  `regular_price` DECIMAL(12,2) NOT NULL,
  `discount_price` DECIMAL(12,2) NULL,
  `cost_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `is_perishable` TINYINT(1) NOT NULL DEFAULT 0,
  `shelf_life_days` INT NULL,
  `min_stock_alert` DECIMAL(10,3) NOT NULL DEFAULT 5.000,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `short_description` TEXT NULL,
  `full_description` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_products_cat` (`category_id`),
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_barcode` (`barcode`),
  CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_prod_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_img_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. LOCATIONS, WAREHOUSES & OUTLETS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `district` VARCHAR(100) NOT NULL,
  `upazila` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `manager_user_id` BIGINT UNSIGNED NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_wh_manager` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `outlets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `manager_user_id` BIGINT UNSIGNED NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_outlet_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_outlet_manager` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. SUPPLIERS & PROCUREMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `supplier_type` ENUM('farmer', 'local_producer', 'dealer', 'distributor', 'manufacturer', 'wholesaler', 'other') NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `alt_phone` VARCHAR(20) NULL,
  `district` VARCHAR(100) NOT NULL,
  `upazila` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `bank_info` TEXT NULL,
  `total_purchased` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_paid` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `balance_due` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sup_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `po_number` VARCHAR(50) NOT NULL UNIQUE,
  `supplier_id` BIGINT UNSIGNED NOT NULL,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `purchase_manager_id` BIGINT UNSIGNED NOT NULL,
  `purchase_date` DATE NOT NULL,
  `status` ENUM('draft', 'ordered', 'partially_received', 'received', 'cancelled') NOT NULL DEFAULT 'draft',
  `total_product_cost` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `transportation_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `loading_unloading_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `packaging_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `other_expenses` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `grand_total_landed` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid') NOT NULL DEFAULT 'unpaid',
  `paid_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `due_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `fk_po_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_po_manager` FOREIGN KEY (`purchase_manager_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `purchase_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `purchase_order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `ordered_weight_qty` DECIMAL(12,3) NOT NULL,
  `unit_purchase_price` DECIMAL(12,2) NOT NULL,
  `allocated_additional_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_cost` DECIMAL(14,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pi_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pi_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. FRESH PRODUCE WEIGHT, SORTING LOSS & BATCH MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `goods_receipts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `grn_number` VARCHAR(50) NOT NULL UNIQUE,
  `purchase_order_id` BIGINT UNSIGNED NOT NULL,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `inspector_user_id` BIGINT UNSIGNED NOT NULL,
  `receipt_date` DATE NOT NULL,
  `status` ENUM('in_inspection', 'completed') NOT NULL DEFAULT 'in_inspection',
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_grn_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `fk_grn_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_grn_inspector` FOREIGN KEY (`inspector_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `goods_receipt_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `goods_receipt_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `purchased_weight_qty` DECIMAL(12,3) NOT NULL,
  `received_weight_qty` DECIMAL(12,3) NOT NULL,
  `accepted_weight_qty` DECIMAL(12,3) NOT NULL,
  `rejected_weight_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `sorting_loss_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `damaged_weight_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `sellable_weight_qty` DECIMAL(12,3) NOT NULL,
  `batch_number` VARCHAR(60) NOT NULL,
  `total_batch_landed_cost` DECIMAL(14,2) NOT NULL,
  `effective_unit_cost` DECIMAL(12,2) NOT NULL,
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_gri_grn` FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gri_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_batches` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `batch_number` VARCHAR(60) NOT NULL UNIQUE,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `goods_receipt_item_id` BIGINT UNSIGNED NULL,
  `initial_sellable_qty` DECIMAL(12,3) NOT NULL,
  `current_remaining_qty` DECIMAL(12,3) NOT NULL,
  `effective_unit_cost` DECIMAL(12,2) NOT NULL,
  `expiry_date` DATE NULL,
  `status` ENUM('active', 'depleted', 'expired', 'quarantined') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_batches_prod` (`product_id`),
  INDEX `idx_batches_expiry` (`expiry_date`),
  CONSTRAINT `fk_pb_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_pb_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. INVENTORY BALANCES & AUDITABLE MOVEMENTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `stock_balances` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `available_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `reserved_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `damaged_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `total_physical_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `avg_unit_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_wh_prod` (`warehouse_id`, `product_id`),
  CONSTRAINT `fk_sb_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_sb_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `batch_id` BIGINT UNSIGNED NULL,
  `movement_type` ENUM('purchase_receipt', 'sale_deduction', 'sorting_loss', 'damage_writeoff', 'transfer_out', 'transfer_in', 'customer_return_restock', 'audit_adjustment') NOT NULL,
  `reference_type` VARCHAR(50) NOT NULL,
  `reference_id` BIGINT UNSIGNED NOT NULL,
  `qty_change` DECIMAL(12,3) NOT NULL,
  `balance_after` DECIMAL(12,3) NOT NULL,
  `unit_cost_snapshot` DECIMAL(12,2) NOT NULL,
  `performed_by_user_id` BIGINT UNSIGNED NOT NULL,
  `reason` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sm_prod` (`product_id`),
  INDEX `idx_sm_wh` (`warehouse_id`),
  CONSTRAINT `fk_sm_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_sm_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_sm_batch` FOREIGN KEY (`batch_id`) REFERENCES `product_batches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sm_user` FOREIGN KEY (`performed_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_transfers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transfer_number` VARCHAR(50) NOT NULL UNIQUE,
  `from_warehouse_id` INT UNSIGNED NOT NULL,
  `to_warehouse_id` INT UNSIGNED NOT NULL,
  `dispatched_by` BIGINT UNSIGNED NOT NULL,
  `received_by` BIGINT UNSIGNED NULL,
  `status` ENUM('pending', 'dispatched', 'received', 'cancelled') NOT NULL DEFAULT 'pending',
  `transfer_date` DATE NOT NULL,
  `received_date` DATE NULL,
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_st_from` FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_st_to` FOREIGN KEY (`to_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_st_disp` FOREIGN KEY (`dispatched_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_st_recv` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_transfer_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `stock_transfer_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `batch_id` BIGINT UNSIGNED NULL,
  `transfer_qty` DECIMAL(12,3) NOT NULL,
  `received_qty` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sti_st` FOREIGN KEY (`stock_transfer_id`) REFERENCES `stock_transfers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sti_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. DELIVERY ZONES & DELIVERY AGENT PROFILES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `delivery_zones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `district` VARCHAR(100) NOT NULL,
  `upazila` VARCHAR(100) NOT NULL,
  `union_name` VARCHAR(100) NULL,
  `area_name` VARCHAR(150) NOT NULL,
  `standard_charge` DECIMAL(10,2) NOT NULL DEFAULT 40.00,
  `emergency_charge` DECIMAL(10,2) NOT NULL DEFAULT 80.00,
  `min_order_amount` DECIMAL(10,2) NOT NULL DEFAULT 200.00,
  `free_delivery_threshold` DECIMAL(10,2) NOT NULL DEFAULT 1500.00,
  `est_delivery_minutes` INT NOT NULL DEFAULT 90,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `idx_dz_loc` (`district`, `upazila`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `delivery_man_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `employee_code` VARCHAR(50) NOT NULL UNIQUE,
  `assigned_zone_id` INT UNSIGNED NULL,
  `vehicle_type` ENUM('bicycle', 'motorcycle', 'van', 'on_foot') NOT NULL DEFAULT 'motorcycle',
  `vehicle_number` VARCHAR(50) NULL,
  `nid_number` VARCHAR(50) NOT NULL,
  `fixed_monthly_salary` DECIMAL(12,2) NOT NULL DEFAULT 12000.00,
  `commission_per_completed_delivery` DECIMAL(10,2) NOT NULL DEFAULT 15.00,
  `marketing_commission_pct` DECIMAL(5,2) NOT NULL DEFAULT 2.00,
  `current_cash_in_hand` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_dmp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dmp_zone` FOREIGN KEY (`assigned_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. ORDERS, ORDER ITEMS & COD CASH HANDOVER
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` BIGINT UNSIGNED NOT NULL,
  `order_source` ENUM('website', 'delivery_man', 'admin_portal', 'call_center') NOT NULL DEFAULT 'website',
  `creator_user_id` BIGINT UNSIGNED NULL,
  `delivery_man_id` BIGINT UNSIGNED NULL,
  `warehouse_id` INT UNSIGNED NOT NULL,
  `delivery_zone_id` INT UNSIGNED NULL,
  `delivery_address` TEXT NOT NULL,
  `delivery_time_slot` VARCHAR(100) NULL,
  `subtotal` DECIMAL(14,2) NOT NULL,
  `discount_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `grand_total` DECIMAL(14,2) NOT NULL,
  `total_cost_snapshot` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `payment_method` ENUM('cod', 'bkash', 'nagad', 'bank') NOT NULL DEFAULT 'cod',
  `payment_status` ENUM('unpaid', 'pending_collection', 'partially_paid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `delivery_status` ENUM('pending', 'confirmed', 'processing', 'packing', 'assigned', 'out_for_delivery', 'delivered', 'completed', 'cancelled', 'failed') NOT NULL DEFAULT 'pending',
  `customer_notes` TEXT NULL,
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_status` (`delivery_status`, `payment_status`),
  INDEX `idx_orders_dm` (`delivery_man_id`),
  CONSTRAINT `fk_ord_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_ord_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_ord_dm` FOREIGN KEY (`delivery_man_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ord_zone` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `batch_id` BIGINT UNSIGNED NULL,
  `quantity` DECIMAL(12,3) NOT NULL,
  `unit_price` DECIMAL(12,2) NOT NULL,
  `cost_price_snapshot` DECIMAL(12,2) NOT NULL,
  `discount_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(14,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_oi_batch` FOREIGN KEY (`batch_id`) REFERENCES `product_batches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `from_status` VARCHAR(50) NOT NULL,
  `to_status` VARCHAR(50) NOT NULL,
  `changed_by_user_id` BIGINT UNSIGNED NOT NULL,
  `comments` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_osh_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cash_handover_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `handover_code` VARCHAR(50) NOT NULL UNIQUE,
  `sender_user_id` BIGINT UNSIGNED NOT NULL,
  `receiver_user_id` BIGINT UNSIGNED NOT NULL,
  `handover_stage` ENUM('delivery_to_admin', 'admin_to_manager', 'manager_to_bank') NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `related_order_ids` JSON NULL,
  `status` ENUM('pending', 'verified', 'disputed', 'rejected') NOT NULL DEFAULT 'pending',
  `sender_notes` TEXT NULL,
  `receiver_notes` TEXT NULL,
  `sender_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_timestamp` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ch_sender` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ch_receiver` FOREIGN KEY (`receiver_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `delivery_commissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `delivery_man_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `commission_type` ENUM('delivery_fixed', 'direct_order_marketing') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('approved', 'reversed', 'paid') NOT NULL DEFAULT 'approved',
  `reversal_reason` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dm_order_comm` (`delivery_man_id`, `order_id`, `commission_type`),
  CONSTRAINT `fk_dc_dm` FOREIGN KEY (`delivery_man_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_dc_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. DOUBLE-ENTRY ACCOUNTING & FINANCIAL MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `chart_of_accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `account_type` ENUM('asset', 'liability', 'equity', 'revenue', 'expense') NOT NULL,
  `parent_id` INT UNSIGNED NULL,
  `normal_balance` ENUM('debit', 'credit') NOT NULL,
  `is_reconciled` TINYINT(1) NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_coa_parent` FOREIGN KEY (`parent_id`) REFERENCES `chart_of_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `journal_entries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entry_number` VARCHAR(50) NOT NULL UNIQUE,
  `entry_date` DATE NOT NULL,
  `reference_type` VARCHAR(50) NOT NULL,
  `reference_id` BIGINT UNSIGNED NOT NULL,
  `narration` TEXT NOT NULL,
  `total_debit` DECIMAL(14,2) NOT NULL,
  `total_credit` DECIMAL(14,2) NOT NULL,
  `posted_by_user_id` BIGINT UNSIGNED NOT NULL,
  `is_reversed` TINYINT(1) NOT NULL DEFAULT 0,
  `reversal_entry_id` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_je_ref` (`reference_type`, `reference_id`),
  CONSTRAINT `fk_je_poster` FOREIGN KEY (`posted_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `journal_entry_lines` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `journal_entry_id` BIGINT UNSIGNED NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  `debit_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `memo` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_jel_account` (`account_id`),
  CONSTRAINT `fk_jel_entry` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jel_account` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `expense_number` VARCHAR(50) NOT NULL UNIQUE,
  `expense_date` DATE NOT NULL,
  `category_account_id` INT UNSIGNED NOT NULL,
  `warehouse_id` INT UNSIGNED NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `payment_account_id` INT UNSIGNED NOT NULL,
  `paid_by_user_id` BIGINT UNSIGNED NOT NULL,
  `approved_by_user_id` BIGINT UNSIGNED NOT NULL,
  `description` TEXT NOT NULL,
  `receipt_url` VARCHAR(255) NULL,
  `journal_entry_id` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_exp_cat` FOREIGN KEY (`category_account_id`) REFERENCES `chart_of_accounts` (`id`),
  CONSTRAINT `fk_exp_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_exp_pay` FOREIGN KEY (`payment_account_id`) REFERENCES `chart_of_accounts` (`id`),
  CONSTRAINT `fk_exp_je` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. INVESTORS, LOANS & MUDHARABAH PROFIT-SHARING
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `investors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `investor_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `nid_number` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `bank_details` TEXT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_inv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `investor_loans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `loan_code` VARCHAR(50) NOT NULL UNIQUE,
  `investor_id` BIGINT UNSIGNED NOT NULL,
  `principal_amount` DECIMAL(14,2) NOT NULL,
  `loan_date` DATE NOT NULL,
  `tenure_months` INT NOT NULL,
  `due_date` DATE NOT NULL,
  `agreed_return_rate_pct` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `repaid_principal` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `repaid_return` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `outstanding_principal` DECIMAL(14,2) NOT NULL,
  `status` ENUM('active', 'partially_repaid', 'settled', 'defaulted') NOT NULL DEFAULT 'active',
  `agreement_doc_url` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_il_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `profit_sharing_investments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `agreement_code` VARCHAR(50) NOT NULL UNIQUE,
  `investor_id` BIGINT UNSIGNED NOT NULL,
  `initial_capital` DECIMAL(14,2) NOT NULL,
  `current_capital` DECIMAL(14,2) NOT NULL,
  `profit_share_percentage` DECIMAL(5,2) NOT NULL,
  `agreement_date` DATE NOT NULL,
  `total_profit_allocated` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_profit_withdrawn` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_capital_withdrawn` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'terminated') NOT NULL DEFAULT 'active',
  `agreement_doc_url` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_psi_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `investor_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_code` VARCHAR(50) NOT NULL UNIQUE,
  `investor_id` BIGINT UNSIGNED NOT NULL,
  `investment_type` ENUM('loan', 'profit_sharing') NOT NULL,
  `loan_id` BIGINT UNSIGNED NULL,
  `profit_sharing_id` BIGINT UNSIGNED NULL,
  `transaction_type` ENUM('principal_received', 'principal_repaid', 'profit_allocated', 'profit_withdrawn', 'capital_withdrawn') NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `transaction_date` DATE NOT NULL,
  `approved_by_user_id` BIGINT UNSIGNED NOT NULL,
  `journal_entry_id` BIGINT UNSIGNED NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_it_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_it_loan` FOREIGN KEY (`loan_id`) REFERENCES `investor_loans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_it_psi` FOREIGN KEY (`profit_sharing_id`) REFERENCES `profit_sharing_investments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_it_je` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. EMPLOYEES, ATTENDANCE & PAYROLL
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `employees` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `employee_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `joining_date` DATE NOT NULL,
  `basic_salary` DECIMAL(12,2) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `emergency_contact` VARCHAR(20) NULL,
  `nid_number` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `status` ENUM('active', 'resigned', 'terminated') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_emp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employee_attendance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` BIGINT UNSIGNED NOT NULL,
  `attendance_date` DATE NOT NULL,
  `status` ENUM('present', 'absent', 'late', 'leave', 'holiday') NOT NULL,
  `in_time` TIME NULL,
  `out_time` TIME NULL,
  `late_minutes` INT NOT NULL DEFAULT 0,
  `remarks` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_emp_att_date` (`employee_id`, `attendance_date`),
  CONSTRAINT `fk_ea_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employee_salaries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` BIGINT UNSIGNED NOT NULL,
  `month_year` VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  `basic_salary` DECIMAL(12,2) NOT NULL,
  `commission_earned` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `bonus` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `deductions` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `advance_deduction` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(12,2) NOT NULL,
  `payment_status` ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
  `paid_at` TIMESTAMP NULL,
  `journal_entry_id` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_emp_month_salary` (`employee_id`, `month_year`),
  CONSTRAINT `fk_es_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_es_je` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. RETURNS & REFUNDS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `return_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `return_number` VARCHAR(50) NOT NULL UNIQUE,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `customer_id` BIGINT UNSIGNED NOT NULL,
  `request_date` DATE NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'inspecting', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `refund_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rr_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_rr_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `return_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `return_request_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `batch_id` BIGINT UNSIGNED NULL,
  `return_qty` DECIMAL(12,3) NOT NULL,
  `inspection_decision` ENUM('restock', 'damage_loss', 'expired', 'supplier_return') NOT NULL,
  `restocked_warehouse_id` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ri_rr` FOREIGN KEY (`return_request_id`) REFERENCES `return_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ri_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. MARKETING: COMBOS, OFFERS & COUPONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` ENUM('percent', 'fixed') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `max_discount_amount` DECIMAL(10,2) NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `usage_limit_per_user` INT NOT NULL DEFAULT 1,
  `total_usage_limit` INT NULL,
  `times_used` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `combos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(170) NOT NULL UNIQUE,
  `regular_price` DECIMAL(12,2) NOT NULL,
  `combo_price` DECIMAL(12,2) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `combo_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `combo_id` INT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `quantity` DECIMAL(12,3) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ci_combo` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ci_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. SYSTEM AUDIT, SETTINGS & NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NULL,
  `group_name` VARCHAR(50) NOT NULL DEFAULT 'general',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` BIGINT UNSIGNED NOT NULL,
  `old_values` JSON NULL,
  `new_values` JSON NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
