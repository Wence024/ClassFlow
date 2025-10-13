-- This function safely updates the schedule configuration.
-- It first checks if reducing the schedule size would orphan any existing timetable assignments.
-- If conflicts exist, it returns an error with a count.
-- If no conflicts exist, it performs the update.

CREATE OR REPLACE FUNCTION update_schedule_configuration_safely(
    config_id uuid,
    new_periods_per_day int,
    new_class_days_per_week int,
    new_start_time time,
    new_period_duration_mins int
)
RETURNS json AS $$
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
$$ LANGUAGE plpgsql;