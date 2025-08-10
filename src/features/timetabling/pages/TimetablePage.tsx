import React, { useMemo, useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';
import {
  Bell,
  User,
  LogOut,
  Calendar,
  Clock,
  Users,
  Settings,
  FileText,
  Eye,
  Plus,
} from 'lucide-react'; // Import icons from lucide-react

// It's a good practice to break down large UI sections into smaller components
const Header = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900">ClassFlow</h1>
          <h2 className="text-lg font-semibold text-gray-700">Timeline Matrix</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Program Head BScs</span>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = () => (
  <aside className="w-64 flex-shrink-0">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <nav className="space-y-2">
        {/* These can be placeholders or link to future routes */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <FileText className="w-4 h-4" />
          Go to My Matrix
        </button>
        {/* ... other sidebar buttons */}
      </nav>
    </div>
  </aside>
);

const TimetablePage: React.FC = () => {
  // --- Existing Hooks ---
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  // --- UI State from Draft ---
  const [selectedView, setSelectedView] = useState('Draft');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your schedule has been approved by Dean', type: 'success' },
    { id: 2, message: 'Conflict detected in Room 201', type: 'error' },
  ]);
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // --- Memoized Data for Drawer (from your existing code) ---
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    for (const classSessions of timetable.values()) {
      for (const session of classSessions) {
        if (session) {
          assignedIds.add(session.id);
        }
      }
    }
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-grow max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Main layout container */}
        <div className="flex gap-6 h-full">
          <Sidebar />
          <Drawer
            drawerClassSessions={drawerClassSessions}
            onDragStart={handleDragStart}
            onDropToDrawer={handleDropToDrawer}
          />

          {/* --- KEY CHANGE IS HERE --- */}
          <main className="flex-1 space-y-6 min-w-0">
            {/* The relative positioning is for the loading spinner */}
            <div className="relative w-full h-full">
              {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-30">
                  <LoadingSpinner size={'md'} text="Loading..." />
                </div>
              )}
              {/* The Timetable component itself does not need to change.
                  It is already set up to scroll internally. */}
              <Timetable
                groups={groups}
                timetable={timetable}
                onDragStart={handleDragStart}
                onDropToGrid={handleDropToGrid}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
