-- Enable real-time replication for critical tables
-- This ensures client-side subscriptions receive updates immediately

-- Enable real-time for resource_requests table
ALTER TABLE public.resource_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resource_requests;

-- Enable real-time for timetable_assignments table (for cross-department approvals)
ALTER TABLE public.timetable_assignments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timetable_assignments;

-- Enable real-time for class_sessions table (for request cancellations)
ALTER TABLE public.class_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_sessions;