import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';

/**
 * Formats a role string for display.
 *
 * @param role - The role string to format (e.g., "program_head").
 * @returns The formatted role string (e.g., "Program Head").
 */
function formatRole(role: string | null): string {
  if (!role) return 'User';
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculates the initials from a user's name or email.
 *
 * @param name - The user's full name or email.
 * @returns The uppercase initials.
 */
function getInitials(name?: string | null) {
  if (!name) return '?';
  const first = name.trim()[0];
  return (first || '?').toUpperCase();
}

/**
 * Renders user information with avatar, name, and role.
 *
 * Displays the user's avatar (initials circle), name, and role with a popover
 * menu for profile and logout actions. Responsive: shows avatar only on mobile,
 * avatar + name on tablet, and full info on desktop.
 *
 * @returns The UserInfo component.
 */
export default function UserInfo() {
  const { user, logout } = useAuth();
  const initials = getInitials(user?.name || user?.email);
  const formattedRole = formatRole(user?.role || null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          data-cy="user-info"
          className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors"
          aria-label={`User menu for ${user?.name || user?.email}`}
        >
          {/* Avatar Circle */}
          <div
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold flex-shrink-0"
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Name and Role - Hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground leading-tight">
              {user?.name || user?.email || 'User'}
            </span>
            <span className="text-xs text-muted-foreground leading-tight hidden lg:block">
              {formattedRole}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2 space-y-1">
        <Link to="/profile" className="block">
          <Button variant="secondary" className="w-full justify-start">
            My Profile
          </Button>
        </Link>
        <Button variant="destructive" className="w-full justify-start" onClick={logout}>
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
