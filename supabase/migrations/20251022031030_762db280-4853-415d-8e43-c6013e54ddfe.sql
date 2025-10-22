-- Phase 2: Add class_session_id column to resource_requests for clarity
-- This separates the actual resource ID (instructor/classroom) from the class session being requested
ALTER TABLE public.resource_requests 
ADD COLUMN class_session_id uuid REFERENCES public.class_sessions(id) ON DELETE CASCADE;

-- Update existing records to populate class_session_id
-- Currently resource_id contains the class_session_id
UPDATE public.resource_requests
SET class_session_id = resource_id
WHERE resource_type IN ('instructor', 'classroom');

-- Make it required for future records
ALTER TABLE public.resource_requests 
ALTER COLUMN class_session_id SET NOT NULL;

-- Phase 4: Enable realtime for request_notifications table
ALTER TABLE public.request_notifications REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.request_notifications;