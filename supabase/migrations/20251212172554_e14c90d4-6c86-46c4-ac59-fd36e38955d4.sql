-- Add billing_clerk to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'billing_clerk';