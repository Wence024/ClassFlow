-- Migration: Auto-cleanup request_notifications
-- Date: 2025-10-29
-- Purpose: Automatically delete request_notifications when requests are approved, rejected, dismissed, or deleted

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.cleanup_request_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- On UPDATE: if status changed from pending OR dismissed flag set, delete notifications
  IF TG_OP = 'UPDATE' THEN
    IF (NEW.status != 'pending' OR NEW.dismissed = true) AND (OLD.status = 'pending' OR OLD.dismissed = false) THEN
      DELETE FROM public.request_notifications WHERE request_id = NEW.id;
    END IF;
    RETURN NEW;
  END IF;

  -- On DELETE: remove all related notifications
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.request_notifications WHERE request_id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Create trigger on UPDATE
DROP TRIGGER IF EXISTS cleanup_notifications_on_update ON public.resource_requests;
CREATE TRIGGER cleanup_notifications_on_update
  AFTER UPDATE ON public.resource_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_request_notifications();

-- Create trigger on DELETE
DROP TRIGGER IF EXISTS cleanup_notifications_on_delete ON public.resource_requests;
CREATE TRIGGER cleanup_notifications_on_delete
  AFTER DELETE ON public.resource_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_request_notifications();

-- Add comment
COMMENT ON FUNCTION public.cleanup_request_notifications() IS 
  'Automatically removes request_notifications when resource_requests are approved, rejected, dismissed, or deleted';
