# 🔍 Architectural Concern Found

Issue: The system allows department_id to be null in the profiles table, but department heads need a department to manage instructors.

Current Behavior:

If a department head has department_id = null, they'll see an error toast: "You must be assigned to a department before creating instructors. Please contact an administrator."
The form button is now clickable, but submission is blocked with a friendly message
Recommendation: Admin should assign every department head to a department during user creation to avoid this edge case.
