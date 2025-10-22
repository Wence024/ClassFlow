-- Fix RLS policies for cross-department resource approval workflow
-- Safe migration that drops existing policies before recreating

-- Fix 1: Add INSERT policy for request_notifications
DROP POLICY IF EXISTS "request_notifications_insert_requester" 
  ON "public"."request_notifications";

CREATE POLICY "request_notifications_insert_requester" 
  ON "public"."request_notifications" 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 2: Expand SELECT policy for resource_requests
DROP POLICY IF EXISTS "resource_requests_select_own" 
  ON "public"."resource_requests";

DROP POLICY IF EXISTS "resource_requests_select_access" 
  ON "public"."resource_requests";

CREATE POLICY "resource_requests_select_access" 
  ON "public"."resource_requests" 
  FOR SELECT 
  TO authenticated 
  USING (
    requester_id = auth.uid()
    OR (
      has_role(auth.uid(), 'department_head')
      AND target_department_id = (
        SELECT department_id 
        FROM profiles 
        WHERE id = auth.uid()
      )
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 3: Add DELETE policy for resource_requests
DROP POLICY IF EXISTS "resource_requests_delete_own" 
  ON "public"."resource_requests";

CREATE POLICY "resource_requests_delete_own" 
  ON "public"."resource_requests" 
  FOR DELETE 
  TO authenticated
  USING (
    requester_id = auth.uid()
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 4: Add DELETE policy for request_notifications
DROP POLICY IF EXISTS "request_notifications_delete" 
  ON "public"."request_notifications";

CREATE POLICY "request_notifications_delete" 
  ON "public"."request_notifications" 
  FOR DELETE 
  TO authenticated
  USING (
    target_department_id = (
      SELECT department_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
    AND has_role(auth.uid(), 'department_head')
    OR has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
  );