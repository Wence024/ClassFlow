-- note: this will work, but there are outdated policies locked to the user id instead of the programs id.

-- Create the "programs" table first as it's referenced by many other tables.
CREATE TABLE public.programs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    short_code text NOT NULL,
    CONSTRAINT programs_pkey PRIMARY KEY (id)
);

-- Create the "semesters" table.
CREATE TABLE public.semesters (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT semesters_pkey PRIMARY KEY (id)
);

-- Create the "schedule_configuration" table which references "semesters".
CREATE TABLE public.schedule_configuration (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    periods_per_day bigint NOT NULL DEFAULT 8,
    class_days_per_week bigint NOT NULL DEFAULT 5,
    start_time time without time zone NOT NULL DEFAULT '07:30:00'::time without time zone,
    period_duration_mins bigint NOT NULL DEFAULT 60,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    semester_id uuid,
    CONSTRAINT schedule_configuration_pkey PRIMARY KEY (id),
    CONSTRAINT schedule_configuration_semester_id_key UNIQUE (semester_id),
    CONSTRAINT schedule_configuration_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id)
);

-- Create the "class_groups" table which references "programs" and "auth.users".
-- Note: Assumes "auth.users" table already exists in Supabase.
CREATE TABLE public.class_groups (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    student_count integer DEFAULT 0 CHECK (student_count >= 0),
    code character varying,
    color character varying DEFAULT '#808080'::character varying,
    program_id uuid,
    CONSTRAINT class_groups_pkey PRIMARY KEY (id),
    CONSTRAINT class_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT class_groups_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

-- Create the "courses" table which references "programs" and "auth.users".
CREATE TABLE public.courses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    color character varying DEFAULT '#6B7280'::character varying,
    program_id uuid,
    CONSTRAINT courses_pkey PRIMARY KEY (id),
    CONSTRAINT courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT courses_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

-- Create the "instructors" table which references "programs" and "auth.users".
CREATE TABLE public.instructors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    first_name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now(),
    last_name text NOT NULL,
    prefix text,
    suffix text,
    code character varying,
    contract_type text,
    phone text,
    color character varying DEFAULT '#6B7280'::character varying,
    program_id uuid,
    CONSTRAINT instructors_pkey PRIMARY KEY (id),
    CONSTRAINT instructors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT instructors_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

-- Create the "classrooms" table which references "programs" and "auth.users".
CREATE TABLE public.classrooms (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    location text,
    created_at timestamp with time zone DEFAULT now(),
    capacity integer CHECK (capacity > 0),
    code character varying,
    color character varying DEFAULT '#6B7280'::character varying,
    program_id uuid,
    CONSTRAINT classrooms_pkey PRIMARY KEY (id),
    CONSTRAINT classrooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT classrooms_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

-- Create the "class_sessions" table which has multiple dependencies.
CREATE TABLE public.class_sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    class_group_id uuid NOT NULL,
    instructor_id uuid NOT NULL,
    classroom_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    period_count integer NOT NULL,
    program_id uuid,
    CONSTRAINT class_sessions_pkey PRIMARY KEY (id),
    CONSTRAINT class_sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
    CONSTRAINT class_sessions_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.instructors(id),
    CONSTRAINT class_sessions_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id),
    CONSTRAINT class_sessions_class_group_id_fkey FOREIGN KEY (class_group_id) REFERENCES public.class_groups(id),
    CONSTRAINT class_sessions_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
    CONSTRAINT class_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create the "timetable_assignments" table.
CREATE TABLE public.timetable_assignments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    class_group_id uuid NOT NULL,
    class_session_id uuid NOT NULL,
    period_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    semester_id uuid NOT NULL,
    CONSTRAINT timetable_assignments_pkey PRIMARY KEY (id),
    CONSTRAINT timetable_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT timetable_assignments_class_session_id_fkey FOREIGN KEY (class_session_id) REFERENCES public.class_sessions(id),
    CONSTRAINT timetable_assignments_class_group_id_fkey FOREIGN KEY (class_group_id) REFERENCES public.class_groups(id),
    CONSTRAINT timetable_assignments_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id)
);

-- Create the "profiles" table which references "programs" and "auth.users".
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    program_id uuid,
    role text NOT NULL DEFAULT 'program_head'::text,
    full_name text,
    avatar_url text,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
    CONSTRAINT profiles_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'program_head' -- Default role for a new user
  );
  RETURN NEW;
END;
$$;

-- 2. Create the trigger that uses the function
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

/**************************************************************************************************/
/* 1. ENABLE ROW-LEVEL SECURITY (RLS) ON ALL RELEVANT TABLES                                      */
/* This is a prerequisite. Without this, the policies below will have no effect.                  */
/**************************************************************************************************/

ALTER TABLE public.timetable_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;


/**************************************************************************************************/
/* 2. POLICIES RELATED TO TIMETABLE / SCHEDULE                                                    */
/**************************************************************************************************/

CREATE POLICY "Allow authenticated read access to all timetable assignments"
ON public.timetable_assignments 
FOR SELECT 
TO public 
USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow program heads to manage their own program's assignments" 
ON public.timetable_assignments 
FOR ALL 
TO public 
USING ( 
  ( 
    (SELECT cs.program_id FROM class_sessions cs WHERE (cs.id = timetable_assignments.class_session_id)) = 
    (SELECT p.program_id FROM profiles p WHERE (p.id = (SELECT auth.uid()))) 
  ) 
);

-- Policies for: class_sessions
CREATE POLICY "Allow users to manage class sessions for their own program." 
ON public.class_sessions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (program_id = (SELECT profiles.program_id FROM profiles WHERE (profiles.id = (SELECT auth.uid()))));


-- Policies for: schedule_configuration
CREATE POLICY "Allow authenticated read access to schedule configuration (select)" 
ON public.schedule_configuration 
FOR SELECT 
TO public 
USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow admins to update schedule configuration" 
ON schedule_configuration 
FOR UPDATE 
TO public 
USING ( ((SELECT profiles.role FROM profiles WHERE (profiles.id = (SELECT auth.uid()))) = 'admin'::text) );


/**************************************************************************************************/
/* 3. POLICIES RELATED TO CLASS GROUPS / CLASSROOMS / COURSES / INSTRUCTORS                       */
/**************************************************************************************************/

-- Policies for: class_groups
CREATE POLICY "Allow authenticated users to read all class groups"
ON public.class_groups
FOR SELECT
TO public
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow users to manage their own class groups" 
ON public.class_groups 
FOR ALL 
TO public 
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policies for: classrooms
CREATE POLICY "Allow authenticated users to read all classrooms" 
ON public.classrooms 
FOR SELECT 
TO public 
USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow users to manage their own classrooms" 
ON public.classrooms 
FOR ALL 
TO public 
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policies for: courses

CREATE POLICY "Allow authenticated users to read all courses" 
ON public.courses 
FOR SELECT 
TO public 
USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow users to manage their own courses" 
ON courses 
FOR ALL 
TO public 
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policies for: instructors

CREATE POLICY "Allow authenticated users to read all instructors" 
ON public.instructors 
FOR SELECT 
TO public 
USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow users to manage their own instructors" 
ON public.instructors 
FOR ALL 
TO public 
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

/**************************************************************************************************/
/* 1. EXPLICIT INDEXES FOR PERFORMANCE                                                            */
/* These indexes are not for uniqueness but are added to speed up common lookups, such as        */
/* finding all records associated with a specific program_id.                                     */
/**************************************************************************************************/

-- For quickly finding classrooms by their program
CREATE INDEX idx_classrooms_program_id ON public.classrooms USING btree (program_id);

-- For quickly finding courses by their program
CREATE INDEX idx_courses_program_id ON public.courses USING btree (program_id);

-- For quickly finding instructors by their program
CREATE INDEX idx_instructors_program_id ON public.instructors USING btree (program_id);


/**************************************************************************************************/
/* 2. EXPLICIT INDEXES FOR COMPLEX CONSTRAINTS                                                    */
/* These unique indexes enforce specific business rules that go beyond a simple primary key.      */
/**************************************************************************************************/

-- Ensures that a specific class group cannot be assigned to the same period more than once
-- for a given user's timetable.
CREATE UNIQUE INDEX unique_group_period ON public.timetable_assignments USING btree (user_id, class_group_id, period_index);

-- Ensures that a specific class group cannot be assigned to the same period within the same
-- semester more than once for a given user's timetable. This is a more specific version of the above.
CREATE UNIQUE INDEX unique_timetable_slot ON public.timetable_assignments USING btree (user_id, class_group_id, period_index, semester_id);

-- Enforces that only one semester can be marked as 'active' (is_active = true).
-- The original `UNIQUE` constraint would prevent more than one 'false' value as well.
-- A partial index is the standard, correct way to enforce "only one can be true".
CREATE UNIQUE INDEX single_active_semester ON public.semesters (is_active) WHERE (is_active = true);
