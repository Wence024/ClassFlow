-- Drop the insecure RLS policies that use raw_user_meta_data
DROP POLICY IF EXISTS "Users can access appointments they have permission for" ON public.appointments;
DROP POLICY IF EXISTS "Users can access medical records they have permission for" ON public.medical_records;
DROP POLICY IF EXISTS "Admin and staff can manage patients" ON public.patients;
DROP POLICY IF EXISTS "Users can view patients they have access to" ON public.patients;

-- Create secure RLS policies using has_role() function for appointments
CREATE POLICY "Admins can manage all appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Medical staff can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'doctor') OR
  public.has_role(auth.uid(), 'nurse') OR
  public.has_role(auth.uid(), 'receptionist') OR
  public.has_role(auth.uid(), 'staff')
);

CREATE POLICY "Patients can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- Create secure RLS policies for medical_records
CREATE POLICY "Admins can manage all medical records"
ON public.medical_records
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can manage medical records"
ON public.medical_records
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'))
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Nurses can view medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'nurse'));

CREATE POLICY "Lab techs can view medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'lab_tech'));

CREATE POLICY "Patients can view their own medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- Create secure RLS policies for patients
CREATE POLICY "Admins can manage all patients"
ON public.patients
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage patients"
ON public.patients
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'staff'))
WITH CHECK (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Medical staff can view patients"
ON public.patients
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'doctor') OR
  public.has_role(auth.uid(), 'nurse') OR
  public.has_role(auth.uid(), 'receptionist')
);

CREATE POLICY "Patients can view their own record"
ON public.patients
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Add trigger to auto-create patient role for new users (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();