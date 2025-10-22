-- Add INSERT policy for request_notifications
-- This allows program heads to create notifications when submitting cross-department requests

CREATE POLICY "request_notifications_insert_requester"
ON public.request_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert if the user is the requester of the associated resource request
  EXISTS (
    SELECT 1
    FROM public.resource_requests
    WHERE resource_requests.id = request_notifications.request_id
      AND resource_requests.requester_id = auth.uid()
  )
  OR
  -- Allow admins to insert notifications
  public.has_role(auth.uid(), 'admin')
);