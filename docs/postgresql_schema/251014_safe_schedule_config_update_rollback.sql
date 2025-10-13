-- This script removes the RPC function for safely updating schedule configuration.
DROP FUNCTION IF EXISTS update_schedule_configuration_safely(uuid, int, int, time, int);
