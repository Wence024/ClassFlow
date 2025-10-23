-- Add INSERT policy for schedule_configuration to allow admins to create initial config
CREATE POLICY "Admins can insert schedule configuration"
ON schedule_configuration
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Insert a default configuration row
INSERT INTO schedule_configuration (
  periods_per_day,
  class_days_per_week,
  start_time,
  period_duration_mins
)
VALUES (8, 5, '09:00', 60)
ON CONFLICT DO NOTHING;