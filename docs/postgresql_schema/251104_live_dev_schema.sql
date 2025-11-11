

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'department_head',
    'program_head'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_delete_user"("target_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Security check: ensure caller is an admin
  SELECT role INTO caller_role FROM public.user_roles WHERE user_id = auth.uid();
  IF caller_role <> 'admin' THEN
    RAISE EXCEPTION 'Permission denied: You must be an administrator to delete users.';
  END IF;

  -- Delete from auth.users (cascades to profiles and user_roles)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;


ALTER FUNCTION "public"."admin_delete_user"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_update_user_name"("target_user_id" "uuid", "new_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if the calling user is an admin
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only admins can update user names';
  END IF;

  -- Update the profiles table
  UPDATE public.profiles
  SET full_name = new_name
  WHERE id = target_user_id;

  -- Update auth metadata
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('name', new_name)
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;


ALTER FUNCTION "public"."admin_update_user_name"("target_user_id" "uuid", "new_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role" DEFAULT NULL::"public"."user_role", "new_program_id" "uuid" DEFAULT NULL::"uuid", "new_department_id" "uuid" DEFAULT NULL::"uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update user profiles';
  END IF;

  -- Update the target user's profile (program_id and department_id)
  UPDATE profiles
  SET
    program_id = CASE WHEN new_program_id IS NOT NULL THEN new_program_id ELSE program_id END,
    department_id = CASE WHEN new_department_id IS NOT NULL THEN new_department_id ELSE department_id END
  WHERE id = target_user_id;

  -- Update or insert the role if provided
  IF new_role IS NOT NULL THEN
    -- Delete existing role
    DELETE FROM user_roles WHERE user_id = target_user_id;
    -- Insert new role
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, new_role);
  END IF;
END;
$$;


ALTER FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") IS 'Atomically approves a resource request and updates related timetable assignments to confirmed status. Returns JSON with success status and details.';



CREATE OR REPLACE FUNCTION "public"."check_dismissed_only_for_reviewed"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF NEW.dismissed = true AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot dismiss a pending request';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_dismissed_only_for_reviewed"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."check_dismissed_only_for_reviewed"() IS 'Prevents dismissing pending requests - only approved/rejected requests can be dismissed';



CREATE OR REPLACE FUNCTION "public"."cleanup_request_notifications"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- For UPDATE: clean up when status changes to approved/rejected
  IF TG_OP = 'UPDATE' AND NEW.status IN ('approved', 'rejected') THEN
    DELETE FROM request_notifications 
    WHERE request_id = NEW.id 
    AND message NOT LIKE '%approved%' 
    AND message NOT LIKE '%rejected%';
    RETURN NEW;
  END IF;
  
  -- For DELETE: clean up ALL notifications for this request
  IF TG_OP = 'DELETE' THEN
    DELETE FROM request_notifications WHERE request_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."cleanup_request_notifications"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_request_notifications"() IS 'Cleans up request notifications when requests are approved, rejected, or deleted. Fires on UPDATE and DELETE.';



CREATE OR REPLACE FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid" DEFAULT NULL::"uuid", "department_id" "uuid" DEFAULT NULL::"uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  new_user_id uuid;
BEGIN
  -- Create the user in the auth.users table and bypass email confirmation.
  -- The handle_new_user trigger will automatically create a basic profile entry.
  INSERT INTO auth.users (email, password, raw_user_meta_data, email_confirmed_at)
  VALUES (email, crypt(password, gen_salt('bf')), jsonb_build_object('full_name', full_name, 'role', role), now())
  RETURNING id INTO new_user_id;

  -- The trigger has run, now update the newly created profile with the specific role and assignments.
  UPDATE public.profiles
  SET
    role = create_test_user.role,
    program_id = create_test_user.program_id,
    department_id = create_test_user.department_id,
    full_name = create_test_user.full_name
  WHERE id = new_user_id;

  RETURN new_user_id;
END;$$;


ALTER FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_test_user"("email" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Find the user's ID from their email
    SELECT id INTO target_user_id FROM auth.users WHERE auth.users.email = delete_test_user.email;

    -- If found, use the admin function to delete the user
    IF target_user_id IS NOT NULL THEN
        PERFORM auth.admin_delete_user(target_user_id);
    ELSE
        RAISE WARNING 'Test user with email % not found.', email;
    END IF;
END;
$$;


ALTER FUNCTION "public"."delete_test_user"("email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT program_id
  FROM public.class_sessions
  WHERE id = _class_session_id
  LIMIT 1
$$;


ALTER FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") IS 'Returns the program_id for a given class_session. Used by RLS policies to avoid recursive queries.';



CREATE OR REPLACE FUNCTION "public"."get_user_department_id"("_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT COALESCE(
    p.department_id,
    (SELECT pr.department_id FROM public.programs pr WHERE pr.id = p.program_id)
  )
  FROM public.profiles p
  WHERE p.id = _user_id
  LIMIT 1
$$;


ALTER FUNCTION "public"."get_user_department_id"("_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_user_department_id"("_user_id" "uuid") IS 'Returns user department ID. For department heads, uses explicit department_id. 
   For program heads, infers from programs.department_id via program_id.
   Returns NULL for admins or users without department/program assignments.
   SECURITY DEFINER to bypass RLS and prevent infinite recursion.';



CREATE OR REPLACE FUNCTION "public"."get_user_program_id"("_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT program_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;


ALTER FUNCTION "public"."get_user_program_id"("_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") IS 'Returns the program_id for a given user from the profiles table. Used by RLS policies to avoid recursive queries.';



CREATE OR REPLACE FUNCTION "public"."get_user_role"("_user_id" "uuid") RETURNS "public"."user_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;


ALTER FUNCTION "public"."get_user_role"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_cross_dept_session_move"("_class_session_id" "uuid", "_old_period_index" integer, "_old_class_group_id" "uuid", "_new_period_index" integer, "_new_class_group_id" "uuid", "_semester_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _program_id uuid;
  _instructor_id uuid;
  _classroom_id uuid;
  _is_cross_dept boolean;
  _target_dept_id uuid;
  _requester_id uuid;
  _new_request_id uuid;
  _updated_count int;
BEGIN
  -- Get class session details
  SELECT program_id, instructor_id, classroom_id, user_id
  INTO _program_id, _instructor_id, _classroom_id, _requester_id
  FROM public.class_sessions
  WHERE id = _class_session_id;

  IF _program_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Class session not found');
  END IF;

  -- Check if it's a cross-department resource
  SELECT public.is_cross_department_resource(_program_id, _instructor_id, _classroom_id)
  INTO _is_cross_dept;

  -- If not cross-dept, perform a normal move and confirm
  IF NOT _is_cross_dept THEN
    UPDATE public.timetable_assignments
    SET class_group_id = _new_class_group_id,
        period_index = _new_period_index,
        status = 'confirmed'
    WHERE class_session_id = _class_session_id
      AND semester_id = _semester_id;

    IF NOT FOUND THEN
      RETURN json_build_object('success', false, 'error', 'No timetable assignment found for this class session in the specified semester');
    END IF;

    RETURN json_build_object('success', true, 'requires_approval', false);
  END IF;

  -- Determine target department
  IF _instructor_id IS NOT NULL THEN
    SELECT department_id INTO _target_dept_id FROM public.instructors WHERE id = _instructor_id;
  END IF;
  IF _target_dept_id IS NULL AND _classroom_id IS NOT NULL THEN
    SELECT preferred_department_id INTO _target_dept_id FROM public.classrooms WHERE id = _classroom_id;
  END IF;
  IF _target_dept_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Could not determine target department');
  END IF;

  -- Move assignment to new position and set status to pending (ATOMIC)
  UPDATE public.timetable_assignments
  SET class_group_id = _new_class_group_id,
      period_index = _new_period_index,
      status = 'pending'
  WHERE class_session_id = _class_session_id
    AND semester_id = _semester_id;

  GET DIAGNOSTICS _updated_count = ROW_COUNT;
  IF _updated_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'No timetable assignment found for this class session in the specified semester');
  END IF;

  -- Create resource request with original position captured for restoration
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

  -- Create notification for department head
  INSERT INTO public.request_notifications (request_id, target_department_id, message)
  VALUES (_new_request_id, _target_dept_id, 'Class session moved - new approval required');

  RETURN json_build_object(
    'success', true, 
    'requires_approval', true, 
    'request_id', _new_request_id, 
    'target_department_id', _target_dept_id
  );
END;
$$;


ALTER FUNCTION "public"."handle_cross_dept_session_move"("_class_session_id" "uuid", "_old_period_index" integer, "_old_class_group_id" "uuid", "_new_period_index" integer, "_new_class_group_id" "uuid", "_semester_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  meta_role public.user_role;
  meta_program_id uuid;
  meta_department_id uuid;
BEGIN
  -- Extract role and assignments from the user's metadata, falling back to default
  meta_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'program_head');
  meta_program_id := (NEW.raw_user_meta_data->>'program_id')::uuid;
  meta_department_id := (NEW.raw_user_meta_data->>'department_id')::uuid;

  -- Create a profile for the new user with the extracted data
  INSERT INTO public.profiles (id, full_name, avatar_url, program_id, department_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    meta_program_id,
    meta_department_id
  );

  -- Insert the role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, meta_role);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid" DEFAULT NULL::"uuid", "_classroom_id" "uuid" DEFAULT NULL::"uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  program_dept_id uuid;
  resource_dept_id uuid;
BEGIN
  -- Get the department_id for the program
  SELECT department_id INTO program_dept_id
  FROM public.programs
  WHERE id = _program_id;

  -- If no program found, return false
  IF program_dept_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check instructor department if provided
  IF _instructor_id IS NOT NULL THEN
    SELECT department_id INTO resource_dept_id
    FROM public.instructors
    WHERE id = _instructor_id;
    
    -- If instructor has a department and it's different from program's department
    IF resource_dept_id IS NOT NULL AND resource_dept_id != program_dept_id THEN
      RETURN true;
    END IF;
  END IF;

  -- Check classroom department if provided
  IF _classroom_id IS NOT NULL THEN
    SELECT preferred_department_id INTO resource_dept_id
    FROM public.classrooms
    WHERE id = _classroom_id;
    
    -- If classroom has a preferred department and it's different from program's department
    IF resource_dept_id IS NOT NULL AND resource_dept_id != program_dept_id THEN
      RETURN true;
    END IF;
  END IF;

  -- No cross-department resource found
  RETURN false;
END;
$$;


ALTER FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reject_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid", "_rejection_message" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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
    RETURN json_build_object('success', false, 'error', 'Resource request not found');
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
    RETURN json_build_object('success', false, 'error', 'No active semester found');
  END IF;

  -- Update the resource request status to rejected
  UPDATE public.resource_requests
  SET status = 'rejected',
      reviewed_by = _reviewer_id,
      reviewed_at = now(),
      rejection_message = _rejection_message
  WHERE id = _request_id;

  -- If we have an original position, restore it regardless of previous status
  IF _original_period_index IS NOT NULL AND _original_class_group_id IS NOT NULL THEN
    UPDATE public.timetable_assignments
    SET period_index = _original_period_index,
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
    -- No original position (initial plotting case): remove from timetable
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
$$;


ALTER FUNCTION "public"."reject_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid", "_rejection_message" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_schedule_configuration_safely"("config_id" "uuid", "new_periods_per_day" integer, "new_class_days_per_week" integer, "new_start_time" time without time zone, "new_period_duration_mins" integer) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    current_total_periods int;
    new_total_periods int;
    conflict_count int;
BEGIN
    -- Get the current configuration to compare against
    SELECT periods_per_day * class_days_per_week INTO current_total_periods
    FROM public.schedule_configuration
    WHERE id = config_id;

    -- Calculate the new total number of periods
    new_total_periods := new_periods_per_day * new_class_days_per_week;

    -- Only check for conflicts if the schedule is shrinking
    IF new_total_periods < current_total_periods THEN
        -- Count any assignments that would be orphaned by this change
        SELECT count(*) INTO conflict_count
        FROM public.timetable_assignments
        WHERE period_index >= new_total_periods;

        -- If conflicts are found, abort and return the count
        IF conflict_count > 0 THEN
            RETURN json_build_object('success', false, 'conflict_count', conflict_count);
        END IF;
    END IF;

    -- If no conflicts (or if the schedule is growing), perform the update
    UPDATE public.schedule_configuration
    SET
        periods_per_day = new_periods_per_day,
        class_days_per_week = new_class_days_per_week,
        start_time = new_start_time,
        period_duration_mins = new_period_duration_mins
    WHERE id = config_id;

    -- Return a success message
    RETURN json_build_object('success', true, 'conflict_count', 0);
END;
$$;


ALTER FUNCTION "public"."update_schedule_configuration_safely"("config_id" "uuid", "new_periods_per_day" integer, "new_class_days_per_week" integer, "new_start_time" time without time zone, "new_period_duration_mins" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."class_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "student_count" integer DEFAULT 0,
    "code" character varying,
    "color" character varying DEFAULT '#808080'::character varying,
    "program_id" "uuid" NOT NULL,
    CONSTRAINT "class_groups_student_count_check" CHECK (("student_count" >= 0))
);


ALTER TABLE "public"."class_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "class_group_id" "uuid" NOT NULL,
    "instructor_id" "uuid" NOT NULL,
    "classroom_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "period_count" integer NOT NULL,
    "program_id" "uuid"
);

ALTER TABLE ONLY "public"."class_sessions" REPLICA IDENTITY FULL;


ALTER TABLE "public"."class_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."classrooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "location" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "capacity" integer,
    "code" character varying,
    "color" character varying DEFAULT '#6B7280'::character varying,
    "created_by" "uuid",
    "preferred_department_id" "uuid",
    CONSTRAINT "classrooms_capacity_check" CHECK (("capacity" > 0))
);


ALTER TABLE "public"."classrooms" OWNER TO "postgres";


COMMENT ON TABLE "public"."classrooms" IS 'Now owned by departments. Consider setting department_id NOT NULL after data backfill.';



CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "color" character varying DEFAULT '#6B7280'::character varying,
    "program_id" "uuid" NOT NULL,
    "units" numeric(3,1),
    "lecture_hours" numeric(3,1),
    "lab_hours" numeric(3,1)
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


COMMENT ON COLUMN "public"."courses"."units" IS 'Course units - auto-calculated from lecture + lab hours, but can be customized';



COMMENT ON COLUMN "public"."courses"."lecture_hours" IS 'Weekly lecture contact hours for the course';



COMMENT ON COLUMN "public"."courses"."lab_hours" IS 'Weekly laboratory contact hours for the course';



CREATE TABLE IF NOT EXISTS "public"."departments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."departments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instructors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_name" "text" NOT NULL,
    "prefix" "text",
    "suffix" "text",
    "code" character varying,
    "contract_type" "text",
    "phone" "text",
    "color" character varying DEFAULT '#6B7280'::character varying,
    "department_id" "uuid",
    "created_by" "uuid"
);


ALTER TABLE "public"."instructors" OWNER TO "postgres";


COMMENT ON TABLE "public"."instructors" IS 'Now owned by departments. Consider setting department_id NOT NULL after data backfill.';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "program_id" "uuid",
    "full_name" "text",
    "avatar_url" "text",
    "department_id" "uuid"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User profiles. department_id should only be set for department heads. 
   Program heads inherit department from their program assignment.';



CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "short_code" "text" NOT NULL,
    "department_id" "uuid"
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "request_id" "uuid" NOT NULL,
    "target_department_id" "uuid" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "read_at" timestamp with time zone
);

ALTER TABLE ONLY "public"."request_notifications" REPLICA IDENTITY FULL;


ALTER TABLE "public"."request_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resource_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "requester_id" "uuid" NOT NULL,
    "resource_type" "text" NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "requesting_program_id" "uuid" NOT NULL,
    "target_department_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "requested_at" timestamp with time zone DEFAULT "now"(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" "uuid",
    "notes" "text",
    "class_session_id" "uuid" NOT NULL,
    "dismissed" boolean DEFAULT false NOT NULL,
    "rejection_message" "text",
    "original_period_index" integer,
    "original_class_group_id" "uuid",
    CONSTRAINT "resource_requests_resource_type_check" CHECK (("resource_type" = ANY (ARRAY['instructor'::"text", 'classroom'::"text"]))),
    CONSTRAINT "resource_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);

ALTER TABLE ONLY "public"."resource_requests" REPLICA IDENTITY FULL;


ALTER TABLE "public"."resource_requests" OWNER TO "postgres";


COMMENT ON TABLE "public"."resource_requests" IS 'Cross-department resource request workflow.';



CREATE TABLE IF NOT EXISTS "public"."schedule_configuration" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "periods_per_day" bigint DEFAULT 8 NOT NULL,
    "class_days_per_week" bigint DEFAULT 5 NOT NULL,
    "start_time" time without time zone DEFAULT '07:30:00'::time without time zone NOT NULL,
    "period_duration_mins" bigint DEFAULT 60 NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "semester_id" "uuid"
);


ALTER TABLE "public"."schedule_configuration" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."semesters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."semesters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teaching_load_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "semester_id" "uuid",
    "department_id" "uuid",
    "units_per_load" numeric(3,1) DEFAULT 3.0 NOT NULL,
    "standard_load" numeric(3,1) DEFAULT 7.0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."teaching_load_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timetable_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "class_group_id" "uuid" NOT NULL,
    "class_session_id" "uuid" NOT NULL,
    "period_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "semester_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'confirmed'::"text" NOT NULL,
    CONSTRAINT "timetable_assignments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'rejected'::"text"])))
);

ALTER TABLE ONLY "public"."timetable_assignments" REPLICA IDENTITY FULL;


ALTER TABLE "public"."timetable_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."user_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."class_groups"
    ADD CONSTRAINT "class_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."classrooms"
    ADD CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_notifications"
    ADD CONSTRAINT "request_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_configuration"
    ADD CONSTRAINT "schedule_configuration_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_configuration"
    ADD CONSTRAINT "schedule_configuration_semester_id_key" UNIQUE ("semester_id");



ALTER TABLE ONLY "public"."semesters"
    ADD CONSTRAINT "semesters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teaching_load_config"
    ADD CONSTRAINT "teaching_load_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teaching_load_config"
    ADD CONSTRAINT "teaching_load_config_semester_id_department_id_key" UNIQUE ("semester_id", "department_id");



ALTER TABLE ONLY "public"."timetable_assignments"
    ADD CONSTRAINT "timetable_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



CREATE INDEX "idx_classrooms_preferred_department" ON "public"."classrooms" USING "btree" ("preferred_department_id");



CREATE INDEX "idx_courses_program_id" ON "public"."courses" USING "btree" ("program_id");



CREATE INDEX "idx_instructors_department" ON "public"."instructors" USING "btree" ("department_id");



CREATE INDEX "idx_programs_department_id" ON "public"."programs" USING "btree" ("department_id");



CREATE INDEX "idx_request_notifications_target_department" ON "public"."request_notifications" USING "btree" ("target_department_id");



CREATE INDEX "idx_resource_requests_dismissed" ON "public"."resource_requests" USING "btree" ("dismissed");



CREATE INDEX "idx_resource_requests_requester_status_dismissed" ON "public"."resource_requests" USING "btree" ("requester_id", "status", "dismissed");



CREATE INDEX "idx_resource_requests_requesting_program" ON "public"."resource_requests" USING "btree" ("requesting_program_id");



CREATE INDEX "idx_resource_requests_status" ON "public"."resource_requests" USING "btree" ("status");



CREATE INDEX "idx_resource_requests_target_department" ON "public"."resource_requests" USING "btree" ("target_department_id");



CREATE INDEX "idx_timetable_assignments_status" ON "public"."timetable_assignments" USING "btree" ("status");



CREATE UNIQUE INDEX "single_active_semester" ON "public"."semesters" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE UNIQUE INDEX "unique_group_period" ON "public"."timetable_assignments" USING "btree" ("user_id", "class_group_id", "period_index");



CREATE UNIQUE INDEX "unique_timetable_slot" ON "public"."timetable_assignments" USING "btree" ("user_id", "class_group_id", "period_index", "semester_id");



CREATE OR REPLACE TRIGGER "cleanup_notifications_on_delete" AFTER DELETE ON "public"."resource_requests" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_request_notifications"();



CREATE OR REPLACE TRIGGER "cleanup_notifications_on_update" AFTER UPDATE ON "public"."resource_requests" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_request_notifications"();



CREATE OR REPLACE TRIGGER "cleanup_request_notifications_trigger" AFTER DELETE OR UPDATE ON "public"."resource_requests" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_request_notifications"();



CREATE OR REPLACE TRIGGER "enforce_dismissed_on_reviewed_only" BEFORE UPDATE ON "public"."resource_requests" FOR EACH ROW WHEN (("new"."dismissed" IS DISTINCT FROM "old"."dismissed")) EXECUTE FUNCTION "public"."check_dismissed_only_for_reviewed"();



ALTER TABLE ONLY "public"."class_groups"
    ADD CONSTRAINT "class_groups_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id");



ALTER TABLE ONLY "public"."class_groups"
    ADD CONSTRAINT "class_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "public"."class_groups"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id");



ALTER TABLE ONLY "public"."class_sessions"
    ADD CONSTRAINT "class_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."classrooms"
    ADD CONSTRAINT "classrooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."classrooms"
    ADD CONSTRAINT "classrooms_preferred_department_id_fkey" FOREIGN KEY ("preferred_department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."request_notifications"
    ADD CONSTRAINT "request_notifications_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."resource_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."request_notifications"
    ADD CONSTRAINT "request_notifications_target_department_id_fkey" FOREIGN KEY ("target_department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_class_session_id_fkey" FOREIGN KEY ("class_session_id") REFERENCES "public"."class_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_requesting_program_id_fkey" FOREIGN KEY ("requesting_program_id") REFERENCES "public"."programs"("id");



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."resource_requests"
    ADD CONSTRAINT "resource_requests_target_department_id_fkey" FOREIGN KEY ("target_department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."schedule_configuration"
    ADD CONSTRAINT "schedule_configuration_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id");



ALTER TABLE ONLY "public"."teaching_load_config"
    ADD CONSTRAINT "teaching_load_config_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teaching_load_config"
    ADD CONSTRAINT "teaching_load_config_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timetable_assignments"
    ADD CONSTRAINT "timetable_assignments_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "public"."class_groups"("id");



ALTER TABLE ONLY "public"."timetable_assignments"
    ADD CONSTRAINT "timetable_assignments_class_session_id_fkey" FOREIGN KEY ("class_session_id") REFERENCES "public"."class_sessions"("id");



ALTER TABLE ONLY "public"."timetable_assignments"
    ADD CONSTRAINT "timetable_assignments_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id");



ALTER TABLE ONLY "public"."timetable_assignments"
    ADD CONSTRAINT "timetable_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can insert schedule configuration" ON "public"."schedule_configuration" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Admins can update schedule configuration" ON "public"."schedule_configuration" FOR UPDATE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Admins can view all profiles" ON "public"."profiles" FOR SELECT USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Admins can view all roles" ON "public"."user_roles" FOR SELECT USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Allow authenticated read access to all timetable assignments" ON "public"."timetable_assignments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated read access to schedule configuration (sele" ON "public"."schedule_configuration" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated read access to teaching load config" ON "public"."teaching_load_config" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read all class groups" ON "public"."class_groups" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to read all class sessions" ON "public"."class_sessions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read all classrooms" ON "public"."classrooms" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to read all courses" ON "public"."courses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to read all departments" ON "public"."departments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read all instructors" ON "public"."instructors" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to read all semesters" ON "public"."semesters" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow program heads and department heads to manage timetable as" ON "public"."timetable_assignments" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("public"."get_class_session_program_id"("class_session_id") = "public"."get_user_program_id"("auth"."uid"()))) OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND (EXISTS ( SELECT 1
   FROM (("public"."class_sessions" "cs"
     JOIN "public"."programs" "prog" ON (("cs"."program_id" = "prog"."id")))
     JOIN "public"."profiles" "prof" ON (("prof"."id" = "auth"."uid"())))
  WHERE (("cs"."id" = "timetable_assignments"."class_session_id") AND ("prog"."department_id" = "prof"."department_id"))))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("public"."get_class_session_program_id"("class_session_id") = "public"."get_user_program_id"("auth"."uid"()))) OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND (EXISTS ( SELECT 1
   FROM (("public"."class_sessions" "cs"
     JOIN "public"."programs" "prog" ON (("cs"."program_id" = "prog"."id")))
     JOIN "public"."profiles" "prof" ON (("prof"."id" = "auth"."uid"())))
  WHERE (("cs"."id" = "timetable_assignments"."class_session_id") AND ("prog"."department_id" = "prof"."department_id")))))));



COMMENT ON POLICY "Allow program heads and department heads to manage timetable as" ON "public"."timetable_assignments" IS 'Allows admins, program heads (for their program), and department heads (for all programs in their department) to manage timetable assignments';



CREATE POLICY "Allow users to manage class sessions for their program" ON "public"."class_sessions" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"()))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"())))));



CREATE POLICY "Allow users to manage their own class groups" ON "public"."class_groups" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Anyone can view all profiles" ON "public"."profiles" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Anyone can view programs" ON "public"."programs" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Only admins can delete programs" ON "public"."programs" FOR DELETE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can insert programs" ON "public"."programs" FOR INSERT WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage departments" ON "public"."departments" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage roles" ON "public"."user_roles" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage semesters" ON "public"."semesters" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage teaching load config" ON "public"."teaching_load_config" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can update programs" ON "public"."programs" FOR UPDATE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Users can delete courses in their program" ON "public"."courses" FOR DELETE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"())))));



CREATE POLICY "Users can insert courses for their program" ON "public"."courses" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "created_by") AND ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"()))))));



CREATE POLICY "Users can update courses in their program" ON "public"."courses" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"()))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'program_head'::"public"."user_role") AND ("program_id" = "public"."get_user_program_id"("auth"."uid"())))));



CREATE POLICY "Users can update their own name and avatar" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own role" ON "public"."user_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."class_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classrooms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "classrooms_manage_admin" ON "public"."classrooms" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."instructors" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "instructors_manage_admin" ON "public"."instructors" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "instructors_manage_department_head" ON "public"."instructors" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("public"."get_user_department_id"("auth"."uid"()) IS NOT NULL) AND ("department_id" = "public"."get_user_department_id"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("public"."get_user_department_id"("auth"."uid"()) IS NOT NULL) AND ("department_id" = "public"."get_user_department_id"("auth"."uid"()))));



COMMENT ON POLICY "instructors_manage_department_head" ON "public"."instructors" IS 'Department heads can manage instructors in their department. 
   Requires explicit department_id assignment (NULL department_id fails explicitly).
   This prevents silent permission failures when department_id is missing.';



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "request_notifications_delete" ON "public"."request_notifications" FOR DELETE TO "authenticated" USING (((("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))) AND "public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role")) OR "public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR (EXISTS ( SELECT 1
   FROM "public"."resource_requests"
  WHERE (("resource_requests"."id" = "request_notifications"."request_id") AND ("resource_requests"."requester_id" = "auth"."uid"()))))));



CREATE POLICY "request_notifications_insert_requester" ON "public"."request_notifications" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."resource_requests"
  WHERE (("resource_requests"."id" = "request_notifications"."request_id") AND ("resource_requests"."requester_id" = "auth"."uid"())))) OR "public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")));



CREATE POLICY "request_notifications_select_department" ON "public"."request_notifications" FOR SELECT TO "authenticated" USING (("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "request_notifications_update_department" ON "public"."request_notifications" FOR UPDATE TO "authenticated" USING (("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))) WITH CHECK (("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



ALTER TABLE "public"."resource_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "resource_requests_delete_own" ON "public"."resource_requests" FOR DELETE TO "authenticated" USING ((("requester_id" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")));



CREATE POLICY "resource_requests_insert_own" ON "public"."resource_requests" FOR INSERT TO "authenticated" WITH CHECK (("requester_id" = "auth"."uid"()));



CREATE POLICY "resource_requests_select_access" ON "public"."resource_requests" FOR SELECT TO "authenticated" USING ((("requester_id" = "auth"."uid"()) OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))) OR "public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")));



CREATE POLICY "resource_requests_update_requesters_dismiss" ON "public"."resource_requests" FOR UPDATE USING ((("requester_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['approved'::"text", 'rejected'::"text"])))) WITH CHECK ((("requester_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['approved'::"text", 'rejected'::"text"]))));



CREATE POLICY "resource_requests_update_reviewers" ON "public"."resource_requests" FOR UPDATE USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("target_department_id" = "public"."get_user_department_id"("auth"."uid"()))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("target_department_id" = "public"."get_user_department_id"("auth"."uid"())))));



ALTER TABLE "public"."schedule_configuration" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."semesters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teaching_load_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timetable_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."class_sessions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."request_notifications";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."resource_requests";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."timetable_assignments";



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO "anon";
GRANT ALL ON SCHEMA "public" TO "authenticated";
GRANT ALL ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."admin_delete_user"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_delete_user"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_delete_user"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_update_user_name"("target_user_id" "uuid", "new_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_update_user_name"("target_user_id" "uuid", "new_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_update_user_name"("target_user_id" "uuid", "new_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."approve_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_dismissed_only_for_reviewed"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_dismissed_only_for_reviewed"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_dismissed_only_for_reviewed"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_request_notifications"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_request_notifications"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_request_notifications"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_department_id"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_department_id"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_department_id"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_cross_dept_session_move"("_class_session_id" "uuid", "_old_period_index" integer, "_old_class_group_id" "uuid", "_new_period_index" integer, "_new_class_group_id" "uuid", "_semester_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_cross_dept_session_move"("_class_session_id" "uuid", "_old_period_index" integer, "_old_class_group_id" "uuid", "_new_period_index" integer, "_new_class_group_id" "uuid", "_semester_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_cross_dept_session_move"("_class_session_id" "uuid", "_old_period_index" integer, "_old_class_group_id" "uuid", "_new_period_index" integer, "_new_class_group_id" "uuid", "_semester_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."reject_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid", "_rejection_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."reject_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid", "_rejection_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reject_resource_request"("_request_id" "uuid", "_reviewer_id" "uuid", "_rejection_message" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_schedule_configuration_safely"("config_id" "uuid", "new_periods_per_day" integer, "new_class_days_per_week" integer, "new_start_time" time without time zone, "new_period_duration_mins" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_schedule_configuration_safely"("config_id" "uuid", "new_periods_per_day" integer, "new_class_days_per_week" integer, "new_start_time" time without time zone, "new_period_duration_mins" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_schedule_configuration_safely"("config_id" "uuid", "new_periods_per_day" integer, "new_class_days_per_week" integer, "new_start_time" time without time zone, "new_period_duration_mins" integer) TO "service_role";


















GRANT ALL ON TABLE "public"."class_groups" TO "anon";
GRANT ALL ON TABLE "public"."class_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."class_groups" TO "service_role";



GRANT ALL ON TABLE "public"."class_sessions" TO "anon";
GRANT ALL ON TABLE "public"."class_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."class_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."classrooms" TO "anon";
GRANT ALL ON TABLE "public"."classrooms" TO "authenticated";
GRANT ALL ON TABLE "public"."classrooms" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."departments" TO "anon";
GRANT ALL ON TABLE "public"."departments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments" TO "service_role";



GRANT ALL ON TABLE "public"."instructors" TO "anon";
GRANT ALL ON TABLE "public"."instructors" TO "authenticated";
GRANT ALL ON TABLE "public"."instructors" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."programs" TO "anon";
GRANT ALL ON TABLE "public"."programs" TO "authenticated";
GRANT ALL ON TABLE "public"."programs" TO "service_role";



GRANT ALL ON TABLE "public"."request_notifications" TO "anon";
GRANT ALL ON TABLE "public"."request_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."request_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."resource_requests" TO "anon";
GRANT ALL ON TABLE "public"."resource_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_requests" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_configuration" TO "anon";
GRANT ALL ON TABLE "public"."schedule_configuration" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_configuration" TO "service_role";



GRANT ALL ON TABLE "public"."semesters" TO "anon";
GRANT ALL ON TABLE "public"."semesters" TO "authenticated";
GRANT ALL ON TABLE "public"."semesters" TO "service_role";



GRANT ALL ON TABLE "public"."teaching_load_config" TO "anon";
GRANT ALL ON TABLE "public"."teaching_load_config" TO "authenticated";
GRANT ALL ON TABLE "public"."teaching_load_config" TO "service_role";



GRANT ALL ON TABLE "public"."timetable_assignments" TO "anon";
GRANT ALL ON TABLE "public"."timetable_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."timetable_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";



























RESET ALL;
