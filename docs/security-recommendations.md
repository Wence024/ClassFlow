# Security Recommendations

## Critical: Role-Based Access Control

### Current Implementation (Not Recommended for Production)

The application currently stores user roles directly on the `profiles` table and reads them client-side. This approach has security risks:

- **Client-side role storage**: Roles stored in `profiles.role` can be manipulated via browser dev tools
- **Trust boundary issue**: Client-side code relies on data that could be tampered with
- **No server-side validation**: RLS policies check against potentially compromised role data

### Recommended Implementation

Implement a proper RBAC system with server-side role validation:

#### 1. Create Role Enum and Table

```sql
-- Create enum for valid roles
CREATE TYPE public.app_role AS ENUM ('admin', 'department_head', 'program_head');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

#### 2. Create Security Definer Function

This function bypasses RLS to check roles without recursion:

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

#### 3. Update RLS Policies

Use the `has_role()` function in all RLS policies:

```sql
-- Example: Admin-only access
CREATE POLICY "Only admins can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Example: Department head access
CREATE POLICY "Department heads can view their department"
ON public.instructors
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'department_head') AND 
   department_id IN (
     SELECT department_id FROM public.profiles WHERE id = auth.uid()
   ))
);
```

#### 4. Update Client-Side Code

Modify `authService.getStoredUser()` to fetch roles from `user_roles` table:

```typescript
// In authService.ts
export async function getStoredUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  // Fetch roles from user_roles table
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', authUser.id);

  const primaryRole = roles?.[0]?.role || null;

  return {
    id: authUser.id,
    email: authUser.email!,
    name: profile?.name || 'Unknown',
    role: primaryRole, // Now fetched from secure table
    program_id: profile?.program_id || null,
    department_id: profile?.department_id || null,
  };
}
```

### Migration Path

1. Create the `user_roles` table and `has_role()` function
2. Migrate existing role data from `profiles.role` to `user_roles`
3. Update all RLS policies to use `has_role()`
4. Update client-side code to fetch from `user_roles`
5. Remove the `role` column from `profiles` table
6. Test thoroughly with different role combinations

### Benefits

- **Server-side enforcement**: Roles validated by PostgreSQL, not client code
- **No recursion issues**: Security definer function bypasses RLS
- **Tamper-proof**: Users cannot modify their own roles via client-side manipulation
- **Auditable**: Clear separation between profile data and authorization
- **Scalable**: Supports multiple roles per user if needed in the future

### References

- [Supabase RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Security Definer Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
