

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


CREATE OR REPLACE FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid" DEFAULT NULL::"uuid", "department_id" "uuid" DEFAULT NULL::"uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create the user in the auth.users table and bypass email confirmation.
  -- The handle_new_user trigger will automatically create a basic profile entry.
  INSERT INTO auth.users (email, password, raw_user_meta_data, email_confirmed_at)
  VALUES (email, crypt(password, gen_salt('bf')), jsonb_build_object('full_name', full_name), now())
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
END;
$$;


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
    "program_id" "uuid",
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
    "program_id" "uuid"
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


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



CREATE INDEX "idx_resource_requests_requesting_program" ON "public"."resource_requests" USING "btree" ("requesting_program_id");



CREATE INDEX "idx_resource_requests_status" ON "public"."resource_requests" USING "btree" ("status");



CREATE INDEX "idx_resource_requests_target_department" ON "public"."resource_requests" USING "btree" ("target_department_id");



CREATE INDEX "idx_timetable_assignments_status" ON "public"."timetable_assignments" USING "btree" ("status");



CREATE UNIQUE INDEX "single_active_semester" ON "public"."semesters" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE UNIQUE INDEX "unique_group_period" ON "public"."timetable_assignments" USING "btree" ("user_id", "class_group_id", "period_index");



CREATE UNIQUE INDEX "unique_timetable_slot" ON "public"."timetable_assignments" USING "btree" ("user_id", "class_group_id", "period_index", "semester_id");



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



CREATE POLICY "Admins can update schedule configuration" ON "public"."schedule_configuration" FOR UPDATE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Admins can view all profiles" ON "public"."profiles" FOR SELECT USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Admins can view all roles" ON "public"."user_roles" FOR SELECT USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Allow authenticated read access to all timetable assignments" ON "public"."timetable_assignments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated read access to schedule configuration (sele" ON "public"."schedule_configuration" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



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



CREATE POLICY "Allow users to manage their own courses" ON "public"."courses" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));



CREATE POLICY "Anyone can view all profiles" ON "public"."profiles" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Anyone can view programs" ON "public"."programs" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Only admins can delete programs" ON "public"."programs" FOR DELETE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can insert programs" ON "public"."programs" FOR INSERT WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage departments" ON "public"."departments" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage roles" ON "public"."user_roles" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can manage semesters" ON "public"."semesters" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



CREATE POLICY "Only admins can update programs" ON "public"."programs" FOR UPDATE USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role"));



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



CREATE POLICY "instructors_manage_department_head" ON "public"."instructors" USING (("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))));



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



CREATE POLICY "resource_requests_update_reviewers" ON "public"."resource_requests" FOR UPDATE USING (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'admin'::"public"."user_role") OR ("public"."has_role"("auth"."uid"(), 'department_head'::"public"."user_role") AND ("target_department_id" = ( SELECT "profiles"."department_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))))));



ALTER TABLE "public"."schedule_configuration" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."semesters" ENABLE ROW LEVEL SECURITY;


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



GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_update_user_profile"("target_user_id" "uuid", "new_role" "public"."user_role", "new_program_id" "uuid", "new_department_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_test_user"("email" "text", "password" "text", "full_name" "text", "role" "public"."user_role", "program_id" "uuid", "department_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_test_user"("email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_class_session_program_id"("_class_session_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_program_id"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_cross_department_resource"("_program_id" "uuid", "_instructor_id" "uuid", "_classroom_id" "uuid") TO "service_role";



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
