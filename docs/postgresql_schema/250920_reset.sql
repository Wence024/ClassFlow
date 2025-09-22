-- OPTION 1

-- This script will completely wipe the 'public' schema and reset it.

-- 1. Drop the entire 'public' schema, including all tables, functions, and policies within it.
-- The 'CASCADE' keyword automatically handles all dependencies.
DROP SCHEMA public CASCADE;

-- 2. Re-create the 'public' schema.
CREATE SCHEMA public;

-- 3. Restore the default Supabase permissions to the new 'public' schema.
-- This is crucial for Supabase's internal workings and for your API access.
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;


-- After running this, your 'public' schema will be empty and ready.
-- You can now run your gigantic schema creation script.

-- OPTION 2

-- This script manually drops each database object in the correct order to respect dependencies.

-- 1. Drop the trigger first, as it depends on the function and a table.
-- Note: The trigger is on the 'auth.users' table, not 'public'.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the function that the trigger uses.
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Drop the tables. You must drop tables with foreign keys first (child tables)
-- before the tables they reference (parent tables).
DROP TABLE IF EXISTS public.timetable_assignments;
DROP TABLE IF EXISTS public.class_sessions;
DROP TABLE IF EXISTS public.class_groups;
DROP TABLE IF EXISTS public.classrooms;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.instructors;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.schedule_configuration;
DROP TABLE IF EXISTS public.semesters;
DROP TABLE IF EXISTS public.programs;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.departments;

-- Note: RLS policies and Indexes are dropped automatically when their table is dropped.
-- You do not need to drop them manually.