-- Update the reject_resource_request function to only remove timetable assignment for pending requests
-- The class session itself should remain intact
CREATE OR REPLACE FUNCTION public.reject_resource_request(_request_id uuid, _reviewer_id uuid, _rejection_message text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _class_session_id uuid;
  _request_status text;
  _original_period_index int;
  _original_class_group_id uuid;
  _active_semester_id uuid;
BEGIN
  -- Get the request details
  SELECT class_session_id, status, original_period_index, original_class_group_id
  INTO _class_session_id, _request_status, _original_period_index, _original_class_group_id
  FROM public.resource_requests
  WHERE id = _request_id;

  IF _class_session_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Resource request not found'
    );
  END IF;

  IF _request_status NOT IN ('pending', 'approved') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Request is not pending or approved (current status: ' || _request_status || ')'
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

  -- Update the resource request status to rejected
  UPDATE public.resource_requests
  SET
    status = 'rejected',
    reviewed_by = _reviewer_id,
    reviewed_at = now(),
    rejection_message = _rejection_message
  WHERE id = _request_id;

  -- If the request was previously approved, restore to original position
  IF _request_status = 'approved' AND _original_period_index IS NOT NULL AND _original_class_group_id IS NOT NULL THEN
    -- Update timetable assignment to restore original position and set to confirmed
    UPDATE public.timetable_assignments
    SET 
      period_index = _original_period_index,
      class_group_id = _original_class_group_id,
      status = 'confirmed'
    WHERE class_session_id = _class_session_id
      AND semester_id = _active_semester_id;

    RETURN json_build_object(
      'success', true,
      'action', 'restored',
      'class_session_id', _class_session_id,
      'restored_to_period', _original_period_index
    );
  ELSE
    -- If pending (initial plotting), only delete the timetable assignment
    -- Keep the class session intact so it can be reused
    DELETE FROM public.timetable_assignments
    WHERE class_session_id = _class_session_id
      AND semester_id = _active_semester_id;

    RETURN json_build_object(
      'success', true,
      'action', 'removed_from_timetable',
      'class_session_id', _class_session_id
    );
  END IF;
END;
$function$;