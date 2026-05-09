-- =====================================================================
-- SUKLIHUB BIR — complete schema (MySQL 8+, MariaDB 10.5+)
-- One-file import: creates DB, tables, default VAT summary rows, settings.
--
-- WARNING: Drops existing suklihub_bir tables below (backup data first).
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS suklihub_bir
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE suklihub_bir;

-- Tear down previous objects (safe re-import)
DROP VIEW IF EXISTS vw_bir_purchase_totals;
DROP VIEW IF EXISTS vw_bir_receipt_totals;
DROP TABLE IF EXISTS inventory_products;
DROP TABLE IF EXISTS products_catalog;
DROP TABLE IF EXISTS bir_vat_summary_line;
DROP TABLE IF EXISTS bir_purchase;
DROP TABLE IF EXISTS bir_official_receipt;
DROP TABLE IF EXISTS bir_settings;

-- ---------------------------------------------------------------------
-- Key/value: company identity, bookkeeping period, OR series, etc.
-- ---------------------------------------------------------------------
CREATE TABLE bir_settings (
  setting_key VARCHAR(64) NOT NULL,
  setting_value TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='EAV bag for taxpayer / period / bookkeeping metadata';

INSERT INTO bir_settings (setting_key, setting_value) VALUES
  ('company_registered_name', ''),
  ('company_trade_name', ''),
  ('company_tin', ''),
  ('company_address', ''),
  ('bir_sec_registration_no', ''),
  ('bookkeeping_period_year', ''),
  ('bookkeeping_period_month', ''),
  ('official_receipt_series', ''),
  ('purchase_journal_code', ''),
  ('notes', '');

-- ---------------------------------------------------------------------
-- Book 1 — Manual of Official Receipts (sales)
-- ---------------------------------------------------------------------
CREATE TABLE bir_official_receipt (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  external_id VARCHAR(64) NULL DEFAULT NULL COMMENT 'POS order id / client uuid — optional unique link',
  sort_order INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Display order (preserve UI sequence)',
  customer_name VARCHAR(255) NOT NULL DEFAULT '',
  or_number VARCHAR(64) NOT NULL DEFAULT '',
  line_date VARCHAR(32) NOT NULL DEFAULT '' COMMENT 'YYYY-MM-DD or free-text as typed',
  order_ref VARCHAR(64) NOT NULL DEFAULT '',
  cashier VARCHAR(255) NOT NULL DEFAULT '',
  amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  vat DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  remarks TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bir_or_external (external_id),
  KEY idx_bir_or_sort (sort_order, id),
  KEY idx_bir_or_date (line_date(10)),
  KEY idx_bir_or_no (or_number),
  KEY idx_bir_or_customer (customer_name(80))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Book 2 — Manual of Purchases
-- ---------------------------------------------------------------------
CREATE TABLE bir_purchase (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  external_id VARCHAR(64) NULL DEFAULT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  supplier VARCHAR(255) NOT NULL DEFAULT '',
  invoice_no VARCHAR(64) NOT NULL DEFAULT '',
  purchase_date VARCHAR(32) NOT NULL DEFAULT '',
  particulars TEXT NOT NULL COMMENT 'Long-form description OK',
  amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  vat DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bir_pv_external (external_id),
  KEY idx_bir_pv_sort (sort_order, id),
  KEY idx_bir_pv_date (purchase_date(10)),
  KEY idx_bir_pv_invoice (supplier(40), invoice_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Book 3 — VAT & sales summary (fixed keys s1–s5 used by POS UI)
-- ---------------------------------------------------------------------
CREATE TABLE bir_vat_summary_line (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  line_key VARCHAR(32) NOT NULL COMMENT 'Stable id: s1 ... s5',
  label VARCHAR(255) NOT NULL DEFAULT '',
  value_text VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'Count or peso figure as typed',
  hint TEXT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bir_sum_key (line_key),
  KEY idx_bir_sum_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO bir_vat_summary_line (line_key, label, value_text, hint, sort_order) VALUES
  ('s1', 'Total BIR receipts (count)', '0', 'Auto from Book 1 — edit if needed', 1),
  ('s2', 'Total VATable sales', '0', 'Gross − VAT columns (approx.)', 2),
  ('s3', 'VAT amount (12%)', '0', 'Rounded from Book 1 VAT column', 3),
  ('s4', 'VAT-exempt sales', '0', 'Manual if you split exempt lines', 4),
  ('s5', 'Gross sales (BIR)', '0', 'Sum of OR amounts', 5);

-- ---------------------------------------------------------------------
-- Reporting helpers (same numbers as footer totals in UI)
-- ---------------------------------------------------------------------
CREATE VIEW vw_bir_receipt_totals AS
SELECT
  COUNT(*) AS line_count,
  COALESCE(SUM(amount), 0) AS gross_sales,
  COALESCE(SUM(vat), 0) AS vat_column_sum
FROM bir_official_receipt;

CREATE VIEW vw_bir_purchase_totals AS
SELECT
  COUNT(*) AS line_count,
  COALESCE(SUM(amount), 0) AS gross_purchases,
  COALESCE(SUM(vat), 0) AS vat_column_sum
FROM bir_purchase;

-- =====================================================================
-- Shared product catalog (all stores) vs per-store inventory
-- Scan → lookup catalog first (reuse name/photo). New SKU → upsert catalog.
-- Inventory = what this store sells (quantities, cost, location, etc.).
-- =====================================================================

CREATE TABLE products_catalog (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  barcode_normalized VARCHAR(32) NOT NULL COMMENT 'Digits-only unique key (EAN/UPC)',
  name VARCHAR(512) NOT NULL DEFAULT '',
  brand VARCHAR(255) NOT NULL DEFAULT '',
  category VARCHAR(128) NOT NULL DEFAULT '',
  unit VARCHAR(64) NOT NULL DEFAULT 'pc',
  image_url TEXT NULL COMMENT 'Permanent URL/path — reused by every store',
  suggested_price DECIMAL(12,2) NULL COMMENT 'SRP hint; store sets real selling price in inventory',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prod_cat_barcode (barcode_normalized),
  KEY idx_prod_cat_name (name(120)),
  KEY idx_prod_cat_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Global SKU knowledge — not stock counts';

CREATE TABLE inventory_products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_key VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT 'Branch / tenant id',
  catalog_id BIGINT UNSIGNED NULL COMMENT 'Optional link — row copied from products_catalog',
  external_id VARCHAR(64) NULL DEFAULT NULL COMMENT 'POS row id client-side',
  name VARCHAR(512) NOT NULL DEFAULT '',
  barcode VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'Display/scanned barcode',
  barcode_normalized VARCHAR(32) NOT NULL DEFAULT '',
  qr_code VARCHAR(128) NOT NULL DEFAULT '',
  category VARCHAR(128) NOT NULL DEFAULT '',
  brand VARCHAR(255) NOT NULL DEFAULT '',
  unit VARCHAR(64) NOT NULL DEFAULT 'pc',
  quantity INT NOT NULL DEFAULT 0,
  cost_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  selling_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  supplier VARCHAR(255) NOT NULL DEFAULT '',
  expiration_date DATE NULL,
  stock_location VARCHAR(128) NOT NULL DEFAULT '',
  min_stock INT NOT NULL DEFAULT 0,
  is_delivery_item TINYINT(1) NOT NULL DEFAULT 0,
  is_bir_item TINYINT(1) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  image_url TEXT NULL COMMENT 'Usually same as catalog; may override',
  status VARCHAR(32) NOT NULL DEFAULT 'in_stock' COMMENT 'in_stock | low_stock | out_of_stock',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inv_store_barcode (store_key, barcode_normalized),
  UNIQUE KEY uq_inv_external (external_id),
  KEY idx_inv_store (store_key),
  KEY idx_inv_catalog (catalog_id),
  KEY idx_inv_name (name(80)),
  CONSTRAINT fk_inv_products_catalog FOREIGN KEY (catalog_id) REFERENCES products_catalog (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Per-store sellable SKUs';

SET FOREIGN_KEY_CHECKS = 1;
