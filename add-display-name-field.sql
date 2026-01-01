-- Migration: Add display_name field for company name normalization
-- Purpose: Store normalized company names (e.g., "Park Hill" instead of "PWT Park Hill")
-- Date: 2025-01-19

-- Add display_name column
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Populate with normalized names for known companies
UPDATE companies
SET display_name = 'Park Hill'
WHERE (name LIKE '%Park Hill%' OR name LIKE '%PWT%' OR name = 'PJT Park Hill')
  AND company_type = 'placement_agent';

UPDATE companies
SET display_name = 'Momentum'
WHERE name LIKE '%Momentum%Group%'
  AND company_type = 'placement_agent';

-- For all others, use original name as default (if display_name is still null)
UPDATE companies
SET display_name = name
WHERE display_name IS NULL;

-- Verify the updates
SELECT
  name as original_name,
  display_name as normalized_name,
  company_type
FROM companies
WHERE company_type = 'placement_agent'
ORDER BY name;
