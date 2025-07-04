import React, { useState } from 'react';
import './Scheduler.css';
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
    <div className="drawer" onDrop={onDropToDrawer} onDragOver={handleDragOver}>
      <h3>Available Classes</h3>
      <ul>
        {drawerClasses.map((classItem, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, { from: 'drawer', className: classItem })}
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
    <div className="timetable">
      <h3>Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th colSpan={8}>Day 1</th>
            <th colSpan={8}>Day 2</th>
          </tr>
          <tr>
            <th></th>
            {Array.from({ length: 16 }, (_, i) => (
              <th key={i}>P{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, groupIndex) => (
            <tr key={groupIndex}>
              <td>{group}</td>
              {timetable[groupIndex].map((item, periodIndex) => (
                <td
                  key={periodIndex}
                  className={item ? 'assigned' : 'empty'}
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
  );
};

// App component
const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, setTimetable } = useTimetable();
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
    setTimetable((prev: (ClassSession | null)[][]) => {
      const updated = prev.map((row: (ClassSession | null)[]) => [...row]);
      // Do not overwrite if destination already filled
      if (updated[groupIndex][periodIndex]) return prev;
      updated[groupIndex][periodIndex] = session;
      // Remove from original location
      if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
        updated[dragSource.groupIndex][dragSource.periodIndex!] = null;
      }
      return updated;
    });
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;
    // Remove from timetable if that's the source
    if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
      setTimetable((prev: (ClassSession | null)[][]) => {
        const updated = prev.map((row: (ClassSession | null)[]) => [...row]);
        updated[dragSource.groupIndex!][dragSource.periodIndex!] = null;
        return updated;
      });
    }
  };

  return (
    <div className="container">
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
