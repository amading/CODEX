-- Optional upgrade from the first suklihub-bir sketch (tables without sort_order / settings).
-- Run by hand if you already have data you cannot drop.
-- Adjust if your server errors on duplicate column / existing view.

USE suklihub_bir;

CREATE TABLE IF NOT EXISTS bir_settings (
  setting_key VARCHAR(64) NOT NULL,
  setting_value TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If bir_official_receipt exists but misses sort_order:
-- ALTER TABLE bir_official_receipt ADD COLUMN sort_order INT UNSIGNED NOT NULL DEFAULT 0 AFTER external_id;

-- If bir_purchase.particulars is VARCHAR(512), widen:
-- ALTER TABLE bir_purchase MODIFY particulars TEXT NOT NULL;

-- Create views after columns exist:
-- CREATE OR REPLACE VIEW vw_bir_receipt_totals AS
-- SELECT COUNT(*) AS line_count, COALESCE(SUM(amount),0) AS gross_sales, COALESCE(SUM(vat),0) AS vat_column_sum
-- FROM bir_official_receipt;
-- CREATE OR REPLACE VIEW vw_bir_purchase_totals AS
-- SELECT COUNT(*) AS line_count, COALESCE(SUM(amount),0) AS gross_purchases, COALESCE(SUM(vat),0) AS vat_column_sum
-- FROM bir_purchase;
