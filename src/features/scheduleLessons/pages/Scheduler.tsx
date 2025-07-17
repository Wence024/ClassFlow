import React, { useState } from 'react';
// import './Scheduler.css'; // Remove old CSS
import { useClassSessions } from '../contexts/ClassSessionsContext';
import { TimetableProvider, useTimetable } from '../contexts/TimetableContext';
import type { ClassSession } from '../types/classSessions';

type DragSource = {
  from: 'drawer' | 'timetable';
  className: string;
  groupIndex?: number;
  periodIndex?: number;
};

// Drawer component
const Drawer: React.FC<{
  drawerClasses: string[];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToDrawer: (e: React.DragEvent) => void;
}> = ({ drawerClasses, onDragStart, onDropToDrawer }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow mb-6 md:mb-0"
      onDrop={onDropToDrawer}
      onDragOver={handleDragOver}
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Available Classes</h3>
      <ul className="space-y-2">
        {drawerClasses.map((classItem, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, { from: 'drawer', className: classItem })}
            className="p-2 bg-gray-100 rounded cursor-grab text-center hover:bg-gray-200 text-gray-900"
          >
            {classItem}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Timetable grid
const Timetable: React.FC<{
  groups: string[];
  timetable: (ClassSession | null)[][];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupIndex: number, periodIndex: number) => void;
}> = ({ groups, timetable, onDragStart, onDropToGrid }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Timetable</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border text-gray-700 bg-gray-100">Group</th>
              <th colSpan={8} className="p-2 border text-gray-700 bg-gray-100">
                Day 1
              </th>
              <th colSpan={8} className="p-2 border text-gray-700 bg-gray-100">
                Day 2
              </th>
            </tr>
            <tr>
              <th className="p-2 border text-gray-700 bg-gray-100"></th>
              {Array.from({ length: 16 }, (_, i) => (
                <th key={i} className="p-2 border text-gray-700 bg-gray-100">
                  P{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <tr key={groupIndex}>
                <td className="p-2 border text-gray-900 font-semibold bg-gray-50">{group}</td>
                {timetable[groupIndex].map((item, periodIndex) => (
                  <td
                    key={periodIndex}
                    className={`p-2 border text-center min-w-[80px] ${item ? 'bg-green-400 text-white font-bold' : 'bg-gray-50 text-gray-900'}`}
                    onDrop={(e) => onDropToGrid(e, groupIndex, periodIndex)}
                    onDragOver={handleDragOver}
                    draggable={!!item}
                    onDragStart={
                      item
                        ? (e) =>
                            onDragStart(e, {
                              from: 'timetable',
                              className: item.course.name + ' - ' + item.group.name,
                              groupIndex,
                              periodIndex,
                            })
                        : undefined
                    }
                  >
                    {item ? item.course.name + ' - ' + item.group.name : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// App component
const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, assignSession, removeSession } = useTimetable();
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
  const [dragSource, setDragSource] = useState<DragSource | null>(null);

  // Helper: get all class session IDs currently in the timetable
  const assignedSessionIds = new Set(
    timetable
      .flat()
      .filter(Boolean)
      .map((cs) => cs!.id)
  );
  // Drawer shows only unassigned sessions
  const drawerSessions = classSessions.filter((cs: ClassSession) => !assignedSessionIds.has(cs.id));
  const drawerClasses = drawerSessions.map((cs) => cs.course.name + ' - ' + cs.group.name);

  // Drag started from drawer or timetable
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    e.dataTransfer.setData('text/plain', source.className);
  };

  // Drop into a timetable cell
  const handleDropToGrid = (e: React.DragEvent, groupIndex: number, periodIndex: number) => {
    e.preventDefault();
    if (!dragSource) return;
    // Find the ClassSession object by name
    const session =
      drawerSessions.find(
        (cs) => cs.course.name + ' - ' + cs.group.name === dragSource.className
      ) || timetable[dragSource.groupIndex ?? 0]?.[dragSource.periodIndex ?? 0];
    if (!session) return;
    // Delegate to context
    if (!timetable[groupIndex][periodIndex]) {
      assignSession(groupIndex, periodIndex, session);
      // Remove from original location
      if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
        removeSession(dragSource.groupIndex, dragSource.periodIndex!);
      }
    }
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;
    // Remove from timetable if that's the source
    if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
      removeSession(dragSource.groupIndex!, dragSource.periodIndex!);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <Drawer
        drawerClasses={drawerClasses}
        onDragStart={handleDragStart}
        onDropToDrawer={handleDropToDrawer}
      />
      <Timetable
        groups={groups}
        timetable={timetable}
        onDragStart={handleDragStart}
        onDropToGrid={handleDropToGrid}
      />
    </div>
  );
};

const Scheduler: React.FC = () => (
  <TimetableProvider>
    <SchedulerApp />
  </TimetableProvider>
);

export default Scheduler;
