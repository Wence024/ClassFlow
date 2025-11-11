-- Migration: Fix SECURITY DEFINER functions missing SET search_path
-- Date: 2025-11-06
-- Purpose: Add SET search_path = 'public' to SECURITY DEFINER functions to prevent
--          search_path manipulation attacks

-- ============================================================================
-- Fix create_test_user function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_test_user(
  email text,
  password text,
  full_name text,
  role public.user_role,
  program_id uuid DEFAULT NULL,
  department_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create the user in the auth.users table and bypass email confirmation.
  -- The handle_new_user trigger will automatically create a basic profile entry.
  INSERT INTO auth.users (email, password, raw_user_meta_data, email_confirmed_at)
  VALUES (email, crypt(password, gen_salt('bf')), jsonb_build_object('full_name', full_name, 'role', role), now())
  RETURNING id INTO new_user_id;

  -- The trigger has run, now update the newly created profile with the specific role and assignments.
  UPDATE public.profiles
  SET
    role = create_test_user.role,
    program_id = create_test_user.program_id,
    department_id = create_test_user.department_id,
    full_name = create_test_user.full_name
  WHERE id = new_user_id;

  RETURN new_user_id;
END;
$$;

COMMENT ON FUNCTION public.create_test_user(text, text, text, public.user_role, uuid, uuid) IS
  'Creates a test user with specified role and assignments. SECURITY DEFINER with search_path set for safety.';

-- ============================================================================
-- Fix delete_test_user function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_test_user(email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find the user's ID from their email
  SELECT id INTO target_user_id FROM auth.users WHERE auth.users.email = delete_test_user.email;

  -- If found, use the admin function to delete the user
  IF target_user_id IS NOT NULL THEN
    PERFORM auth.admin_delete_user(target_user_id);
  ELSE
    RAISE WARNING 'Test user with email % not found.', email;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.delete_test_user(text) IS
  'Deletes a test user by email. SECURITY DEFINER with search_path set for safety.';

-- ============================================================================
-- Fix check_dismissed_only_for_reviewed function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_dismissed_only_for_reviewed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.dismissed = true AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot dismiss a pending request';
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.check_dismissed_only_for_reviewed() IS
  'Prevents dismissing pending requests - only approved/rejected requests can be dismissed. SECURITY DEFINER with search_path set for safety.';

-- ============================================================================
-- Fix cleanup_request_notifications function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cleanup_request_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For UPDATE: clean up when status changes to approved/rejected
  IF TG_OP = 'UPDATE' AND NEW.status IN ('approved', 'rejected') THEN
    DELETE FROM request_notifications 
    WHERE request_id = NEW.id 
    AND message NOT LIKE '%approved%' 
    AND message NOT LIKE '%rejected%';
    RETURN NEW;
  END IF;
  
  -- For DELETE: clean up ALL notifications for this request
  IF TG_OP = 'DELETE' THEN
    DELETE FROM request_notifications WHERE request_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.cleanup_request_notifications() IS
  'Automatically removes request_notifications when resource_requests are approved, rejected, dismissed, or deleted. SECURITY DEFINER with search_path set for safety.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all SECURITY DEFINER functions now have search_path set:
-- SELECT 
--   proname as function_name,
--   prosecdef as is_security_definer,
--   proconfig as config_settings
-- FROM pg_proc
-- WHERE pronamespace = 'public'::regnamespace
--   AND prosecdef = true
-- ORDER BY proname;
