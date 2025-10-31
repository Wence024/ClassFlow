-- Migration: Fix Program Head Notification Dismissal
-- Date: 2025-10-31
-- Purpose: Allow Program Heads to dismiss their own reviewed requests

-- Drop the existing overly restrictive update policy
DROP POLICY IF EXISTS "resource_requests_update_reviewers" ON public.resource_requests;

-- Create a NEW policy that allows requesters to dismiss their own reviewed requests
CREATE POLICY "resource_requests_update_requesters_dismiss"
ON public.resource_requests FOR UPDATE
USING (
  requester_id = auth.uid()
  AND status IN ('approved', 'rejected')
)
WITH CHECK (
  requester_id = auth.uid()
  AND status IN ('approved', 'rejected')
);

-- Recreate the reviewers policy for full update permissions
CREATE POLICY "resource_requests_update_reviewers"
ON public.resource_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'department_head') AND 
   target_department_id = public.get_user_department_id(auth.uid()))
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'department_head') AND 
   target_department_id = public.get_user_department_id(auth.uid()))
);

-- Add a check to ensure dismissed can only be true for reviewed requests
CREATE OR REPLACE FUNCTION public.check_dismissed_only_for_reviewed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.dismissed = true AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot dismiss a pending request';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_dismissed_on_reviewed_only
BEFORE UPDATE ON public.resource_requests
FOR EACH ROW
WHEN (NEW.dismissed IS DISTINCT FROM OLD.dismissed)
EXECUTE FUNCTION public.check_dismissed_only_for_reviewed();

-- Add comment
COMMENT ON FUNCTION public.check_dismissed_only_for_reviewed() IS 
  'Prevents dismissing pending requests - only approved/rejected requests can be dismissed';