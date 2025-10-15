-- Update the handle_new_user trigger to process invitation metadata
-- This function now reads role, program_id, and department_id from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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