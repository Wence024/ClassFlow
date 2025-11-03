-- Create a database function to atomically approve resource requests and update timetable assignments
-- This ensures both operations succeed or fail together, with proper permissions

CREATE OR REPLACE FUNCTION public.approve_resource_request(
  _request_id uuid,
  _reviewer_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _class_session_id uuid;
  _active_semester_id uuid;
  _assignment_count int;
  _request_status text;
BEGIN
  -- Get the request details and validate it exists
  SELECT class_session_id, status INTO _class_session_id, _request_status
  FROM public.resource_requests
  WHERE id = _request_id;

  IF _class_session_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Resource request not found'
    );
  END IF;

  IF _request_status != 'pending' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Request is not pending (current status: ' || _request_status || ')'
    );
  END IF;

  -- Get the active semester
  SELECT id INTO _active_semester_id
  FROM public.semesters
  WHERE is_active = true
  LIMIT 1;

  IF _active_semester_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No active semester found'
    );
  END IF;

  -- Check if timetable assignment exists
  SELECT count(*) INTO _assignment_count
  FROM public.timetable_assignments
  WHERE class_session_id = _class_session_id
    AND semester_id = _active_semester_id;

  IF _assignment_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No timetable assignment found for this class session in the active semester'
    );
  END IF;

  -- Update the resource request status
  UPDATE public.resource_requests
  SET
    status = 'approved',
    reviewed_by = _reviewer_id,
    reviewed_at = now()
  WHERE id = _request_id;

  -- Update all timetable assignments for this class session to 'confirmed'
  UPDATE public.timetable_assignments
  SET status = 'confirmed'
  WHERE class_session_id = _class_session_id
    AND semester_id = _active_semester_id
    AND status = 'pending';

  -- Return success with details
  RETURN json_build_object(
    'success', true,
    'updated_assignments', _assignment_count,
    'class_session_id', _class_session_id,
    'semester_id', _active_semester_id
  );
END;
$$;

-- Add helpful comment
COMMENT ON FUNCTION public.approve_resource_request IS 'Atomically approves a resource request and updates related timetable assignments to confirmed status. Returns JSON with success status and details.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.approve_resource_request TO authenticated;