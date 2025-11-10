-- Create cancel_resource_request function to handle program head cancellations
-- Mirrors reject_resource_request but enforces requester permission
CREATE OR REPLACE FUNCTION public.cancel_resource_request(
  _request_id uuid,
  _requester_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _class_session_id uuid;
  _request_status text;
  _original_period_index int;
  _original_class_group_id uuid;
  _active_semester_id uuid;
  _target_department_id uuid;
  _actual_requester_id uuid;
BEGIN
  -- Get the request details and validate requester
  SELECT class_session_id, status, original_period_index, original_class_group_id, 
         target_department_id, requester_id
  INTO _class_session_id, _request_status, _original_period_index, _original_class_group_id,
       _target_department_id, _actual_requester_id
  FROM public.resource_requests
  WHERE id = _request_id;

  IF _class_session_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Resource request not found');
  END IF;

  -- Validate requester has permission
  IF _actual_requester_id != _requester_id THEN
    RETURN json_build_object('success', false, 'error', 'Permission denied: You can only cancel your own requests');
  END IF;

  IF _request_status NOT IN ('pending', 'approved') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Request cannot be cancelled (current status: ' || _request_status || ')'
    );
  END IF;

  -- Get the active semester
  SELECT id INTO _active_semester_id
  FROM public.semesters
  WHERE is_active = true
  LIMIT 1;

  IF _active_semester_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No active semester found');
  END IF;

  -- Create cancellation notification for department head
  INSERT INTO public.request_notifications (request_id, target_department_id, message)
  VALUES (_request_id, _target_department_id, 'Request cancelled by program head');

  -- If we have an original position, restore it (previously approved request)
  IF _original_period_index IS NOT NULL AND _original_class_group_id IS NOT NULL THEN
    UPDATE public.timetable_assignments
    SET period_index = _original_period_index,
        class_group_id = _original_class_group_id,
        status = 'confirmed'
    WHERE class_session_id = _class_session_id
      AND semester_id = _active_semester_id;

    -- Delete the request
    DELETE FROM public.resource_requests WHERE id = _request_id;

    RETURN json_build_object(
      'success', true,
      'action', 'restored',
      'class_session_id', _class_session_id,
      'restored_to_period', _original_period_index
    );
  ELSE
    -- No original position (initial plotting case): remove from timetable
    DELETE FROM public.timetable_assignments
    WHERE class_session_id = _class_session_id
      AND semester_id = _active_semester_id;

    -- Delete the request
    DELETE FROM public.resource_requests WHERE id = _request_id;

    RETURN json_build_object(
      'success', true,
      'action', 'removed_from_timetable',
      'class_session_id', _class_session_id
    );
  END IF;
END;
$$;