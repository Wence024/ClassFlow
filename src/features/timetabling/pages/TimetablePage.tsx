import React, { useMemo, useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification } from '../../../components/ui';
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 space-y-6">
            {/* You can add the Views and Management buttons here as a new component */}

            <div className="relative w-full">
              {loading && (
                <div className="absolute right-1/2 top-4 -translate-x-1/2 z-10">
                  <LoadingSpinner size={'md'} text="" />
                </div>
              )}
              <Timetable
                groups={groups}
                timetable={timetable}
                onDragStart={handleDragStart}
                onDropToGrid={handleDropToGrid}
              />
            </div>
            <Drawer
              drawerClassSessions={drawerClassSessions}
              onDragStart={handleDragStart}
              onDropToDrawer={handleDropToDrawer}
            />
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                Submit
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Notifications Area */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 rounded-lg shadow-lg max-w-sm ...`}>
            <Notification />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
