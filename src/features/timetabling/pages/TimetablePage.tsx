import { useMemo } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const TimetablePage: React.FC = () => {
  // --- Existing Hooks ---
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  // --- UI State from Draft ---
  // const [selectedView, setSelectedView] = useState('Draft');
  // const [notifications, setNotifications] = useState([
  //   { id: 1, message: 'Your schedule has been approved by Dean', type: 'success' },
  //   { id: 2, message: 'Conflict detected in Room 201', type: 'error' },
  // ]);
  // const dismissNotification = (id) => {
  //   setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  // };

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
        <div className="flex gap-6 h-full flex-col-reverse">
          {' '}
          {/* This changes the flex direction to column-reverse */}
          <Sidebar />
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
              {/* Drawer below the timetable now */}
              <Drawer
                drawerClassSessions={drawerClassSessions}
                onDragStart={handleDragStart}
                onDropToDrawer={handleDropToDrawer}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
