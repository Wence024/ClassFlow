import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';

function getInitials(name?: string | null) {
  if (!name) return '?';
  const first = name.trim()[0];
  return (first || '?').toUpperCase();
}

export default function UserAvatar() {
  const { user, logout } = useAuth();
  const initials = getInitials(user?.name || user?.email);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2 space-y-1">
        <Link to="/profile" className="block">
          <Button variant="secondary" className="w-full justify-start">My Profile</Button>
        </Link>
        <Button variant="destructive" className="w-full justify-start" onClick={logout}>Logout</Button>
      </PopoverContent>
    </Popover>
  );
}


