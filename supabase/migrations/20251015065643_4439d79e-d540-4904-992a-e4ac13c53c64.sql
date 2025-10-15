-- Fix the handle_new_user trigger to correctly populate both profiles and user_roles tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Insert default role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'program_head');
  
  RETURN NEW;
END;
$$;

-- Create admin-only RPC to securely delete users
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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