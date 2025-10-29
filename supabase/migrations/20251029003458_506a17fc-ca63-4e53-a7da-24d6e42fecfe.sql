-- Phase 1: Database Changes for Resource Request Rejection and Cross-Department Handling

-- 1. Add columns to resource_requests table for tracking rejection and original position
ALTER TABLE public.resource_requests
ADD COLUMN IF NOT EXISTS rejection_message TEXT,
ADD COLUMN IF NOT EXISTS original_period_index INTEGER,
ADD COLUMN IF NOT EXISTS original_class_group_id UUID;

-- 2. Create function to reject a resource request with message
CREATE OR REPLACE FUNCTION public.reject_resource_request(
  _request_id uuid,
  _reviewer_id uuid,
  _rejection_message text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    -- If pending or no original position, delete the timetable assignment and class session
    DELETE FROM public.timetable_assignments
    WHERE class_session_id = _class_session_id
      AND semester_id = _active_semester_id;

    DELETE FROM public.class_sessions
    WHERE id = _class_session_id;

    RETURN json_build_object(
      'success', true,
      'action', 'deleted',
      'class_session_id', _class_session_id
    );
  END IF;
END;
$$;

-- 3. Create function to handle cross-department session moves
CREATE OR REPLACE FUNCTION public.handle_cross_dept_session_move(
  _class_session_id uuid,
  _old_period_index int,
  _old_class_group_id uuid,
  _new_period_index int,
  _new_class_group_id uuid,
  _semester_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _program_id uuid;
  _instructor_id uuid;
  _classroom_id uuid;
  _is_cross_dept boolean;
  _target_dept_id uuid;
  _requester_id uuid;
  _new_request_id uuid;
BEGIN
  -- Get class session details
  SELECT program_id, instructor_id, classroom_id, user_id
  INTO _program_id, _instructor_id, _classroom_id, _requester_id
  FROM public.class_sessions
  WHERE id = _class_session_id;

  IF _program_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Class session not found'
    );
  END IF;

  -- Check if it's a cross-department resource
  SELECT public.is_cross_department_resource(_program_id, _instructor_id, _classroom_id)
  INTO _is_cross_dept;

  IF NOT _is_cross_dept THEN
    -- Not cross-department, no special handling needed
    RETURN json_build_object(
      'success', true,
      'requires_approval', false
    );
  END IF;

  -- Determine target department
  IF _instructor_id IS NOT NULL THEN
    SELECT department_id INTO _target_dept_id
    FROM public.instructors
    WHERE id = _instructor_id;
  END IF;

  IF _target_dept_id IS NULL AND _classroom_id IS NOT NULL THEN
    SELECT preferred_department_id INTO _target_dept_id
    FROM public.classrooms
    WHERE id = _classroom_id;
  END IF;

  IF _target_dept_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Could not determine target department'
    );
  END IF;

  -- Change existing assignment status to pending
  UPDATE public.timetable_assignments
  SET status = 'pending'
  WHERE class_session_id = _class_session_id
    AND semester_id = _semester_id;

  -- Create new resource request with original position stored
  INSERT INTO public.resource_requests (
    requester_id,
    class_session_id,
    resource_type,
    resource_id,
    target_department_id,
    requesting_program_id,
    status,
    original_period_index,
    original_class_group_id
  )
  VALUES (
    _requester_id,
    _class_session_id,
    CASE WHEN _instructor_id IS NOT NULL THEN 'instructor' ELSE 'classroom' END,
    COALESCE(_instructor_id, _classroom_id),
    _target_dept_id,
    _program_id,
    'pending',
    _old_period_index,
    _old_class_group_id
  )
  RETURNING id INTO _new_request_id;

  -- Create notification
  INSERT INTO public.request_notifications (
    request_id,
    target_department_id,
    message
  )
  VALUES (
    _new_request_id,
    _target_dept_id,
    'Class session moved - new approval required'
  );

  RETURN json_build_object(
    'success', true,
    'requires_approval', true,
    'request_id', _new_request_id,
    'target_department_id', _target_dept_id
  );
END;
$$;