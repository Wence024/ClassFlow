# Current Risk: Roles stored on user object can be manipulated client-side

Recommended (per security guidelines):

1. Create user_roles table with enum type
2. Implement has_role() security definer function
3. Update RLS policies to use the function
4. Modify authService.getStoredUser() to fetch roles from the separate table

Note: This is a larger architectural change and should be planned separately.
