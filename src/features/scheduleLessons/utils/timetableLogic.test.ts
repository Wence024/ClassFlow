import {
  assignSessionToTimetable,
  removeSessionFromTimetable,
  moveSessionInTimetable,
} from './timetableLogic';
import type {
  ClassSession,
  Course,
  ClassGroup,
  Instructor,
  Classroom,
} from '../types/scheduleLessons';

describe('timetableLogic', () => {
  const course: Course = { id: 'c1', name: 'Math', code: 'MATH101' };
  const groupA: ClassGroup = { id: 'gA', name: 'Group A' };
  const groupB: ClassGroup = { id: 'gB', name: 'Group B' };
  const instructor: Instructor = { id: 'i1', name: 'Alice', email: 'alice@example.com' };
  const classroom: Classroom = { id: 'r1', name: 'Room 1', location: 'Building A' };

  const sessionA: ClassSession = {
    id: 'sA',
    course,
    group: groupA,
    instructor,
    classroom,
  };
  const sessionB: ClassSession = {
    id: 'sB',
    course,
    group: groupB,
    instructor,
    classroom,
  };

  function emptyTimetable() {
    return new Map([
      [groupA.id, Array(2).fill(null)],
      [groupB.id, Array(2).fill(null)],
    ]);
  }

  it('assigns a session to an empty slot', () => {
    const timetable = emptyTimetable();
    const { updatedTimetable, error } = assignSessionToTimetable(timetable, groupA.id, 0, sessionA);
    expect(error).toBeFalsy();
    expect(updatedTimetable.get(groupA.id)?.[0]).toEqual(sessionA);
  });

  it('prevents assigning to an occupied slot (group conflict)', () => {
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![0] = sessionA;
    const { error } = assignSessionToTimetable(timetable, groupA.id, 0, sessionA);
    expect(error).toMatch(/Group conflict/);
  });

  it('prevents instructor conflict across groups', () => {
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![0] = sessionA;
    const { error } = assignSessionToTimetable(timetable, groupB.id, 0, sessionB);
    expect(error).toMatch(/Instructor conflict/);
  });

  it('prevents classroom conflict across groups', () => {
    const sessionB2 = { ...sessionB, instructor: { ...instructor, id: 'i2', name: 'Bob' } };
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![0] = sessionA;
    const { error } = assignSessionToTimetable(timetable, groupB.id, 0, sessionB2);
    expect(error).toMatch(/Classroom conflict/);
  });

  it('removes a session from a slot', () => {
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![1] = sessionA;
    const updated = removeSessionFromTimetable(timetable, groupA.id, 1);
    expect(updated.get(groupA.id)?.[1]).toBeNull();
  });

  it('moves a session to a new slot (no conflict)', () => {
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![0] = sessionA;
    const { updatedTimetable, error } = moveSessionInTimetable(
      timetable,
      { groupId: groupA.id, periodIndex: 0 },
      { groupId: groupB.id, periodIndex: 1 }
    );
    expect(error).toBeFalsy();
    expect(updatedTimetable.get(groupA.id)?.[0]).toBeNull();
    expect(updatedTimetable.get(groupB.id)?.[1]).toEqual(sessionA);
  });

  it('prevents move if target slot has group conflict', () => {
    const timetable = emptyTimetable();
    timetable.get(groupA.id)![0] = sessionA;
    timetable.get(groupB.id)![1] = sessionB;
    const { error } = moveSessionInTimetable(
      timetable,
      { groupId: groupA.id, periodIndex: 0 },
      { groupId: groupB.id, periodIndex: 1 }
    );
    expect(error).toMatch(/Group conflict/);
  });
});
