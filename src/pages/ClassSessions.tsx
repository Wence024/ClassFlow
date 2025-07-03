import React, { useState } from 'react';
import './ClassSessions.css';
import { useClassSessions } from '../context/ClassSessionsContext';
import { useComponents } from '../context/ComponentsContext';
import { apiClassSessions } from '../api/classSessions';
import { useForm } from '../hooks/useForm';
import type { ClassSession } from '../types/classSessions';

const ClassSessions: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
  const { courses, classGroups, classrooms, instructors } = useComponents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state uses IDs for selects
  const { values, isEditing, editId, handleSelectChange, resetForm, setEditValues } = useForm({
    id: '',
    courseId: null as string | null,
    classGroupId: null as string | null,
    instructorId: null as string | null,
    classroomId: null as string | null,
  });

  // Normalize backend session to frontend shape
  const normalizeSession = (session: any): ClassSession => ({
    id: session.id ?? session._id ?? '',
    course:
      typeof session.course === 'string'
        ? courses.find((c) => c.id === session.course) || { id: session.course, name: '', code: '' }
        : session.course,
    classGroup:
      typeof session.classGroup === 'string'
        ? classGroups.find((g) => g.id === session.classGroup) || {
            id: session.classGroup,
            name: '',
          }
        : session.classGroup,
    instructor:
      typeof session.instructor === 'string'
        ? instructors.find((i) => i.id === session.instructor) || {
            id: session.instructor,
            name: '',
            email: '',
          }
        : session.instructor,
    classroom:
      typeof session.classroom === 'string'
        ? classrooms.find((r) => r.id === session.classroom) || {
            id: session.classroom,
            name: '',
            location: '',
          }
        : session.classroom,
  });

  const createClassSession = async () => {
    if (!values.courseId || !values.classGroupId || !values.instructorId || !values.classroomId) {
      alert('Please fill out all fields before creating a class session.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const created = await apiClassSessions.create({
        course: values.courseId,
        classGroup: values.classGroupId,
        instructor: values.instructorId,
        classroom: values.classroomId,
      });
      setClassSessions((prev) => [...prev, normalizeSession(created)]);
      resetForm();
    } catch {
      setError('Failed to create class session');
    } finally {
      setLoading(false);
    }
  };

  const updateClassSession = async () => {
    if (
      !editId ||
      !values.courseId ||
      !values.classGroupId ||
      !values.instructorId ||
      !values.classroomId
    ) {
      alert('Please fill out all fields before saving changes.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updated = await apiClassSessions.update(editId, {
        course: values.courseId,
        classGroup: values.classGroupId,
        instructor: values.instructorId,
        classroom: values.classroomId,
      });
      setClassSessions((prev) =>
        prev.map((session) => (session.id === editId ? normalizeSession(updated) : session))
      );
      resetForm();
    } catch {
      setError('Failed to update class session');
    } finally {
      setLoading(false);
    }
  };

  const removeClassSession = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClassSessions.delete(id);
      setClassSessions((prev) => prev.filter((session) => session.id !== id));
      if (editId === id) resetForm();
    } catch {
      setError('Failed to delete class session');
    } finally {
      setLoading(false);
    }
  };

  const editClassSession = (id: string) => {
    const session = classSessions.find((s) => s.id === id);
    if (session) {
      setEditValues({
        id: session.id,
        courseId: session.course.id,
        classGroupId: session.classGroup.id,
        instructorId: session.instructor.id,
        classroomId: session.classroom.id,
      });
    }
  };

  return (
    <div className="container main-flex">
      <div className="sessions-list-container">
        <h1>Class Session Management</h1>
        <div className="class-sessions">
          <h2>Class Sessions</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : classSessions.length === 0 ? (
            <p>No class sessions created yet.</p>
          ) : (
            classSessions.map((session) => (
              <div key={`session-${session.id}`} className="class-session">
                <h3>
                  {session.course?.name ?? 'Unknown Course'} -{' '}
                  {session.classGroup?.name ?? 'Unknown Group'}
                </h3>
                <p>Instructor: {session.instructor?.name ?? 'Unknown Instructor'}</p>
                <p>Classroom: {session.classroom?.name ?? 'Unknown Classroom'}</p>
                <div className="buttons">
                  <button onClick={() => removeClassSession(session.id)} disabled={loading}>
                    Remove
                  </button>
                  <button onClick={() => editClassSession(session.id)} disabled={loading}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="form-container">
        <h2>{isEditing ? 'Edit Class Session' : 'Create Class Session'}</h2>
        <div className="create-session-form">
          {[
            {
              label: 'Course',
              value: values.courseId,
              setValue: (val: string | null) => handleSelectChange('courseId', val),
              options: courses,
            },
            {
              label: 'Class Group',
              value: values.classGroupId,
              setValue: (val: string | null) => handleSelectChange('classGroupId', val),
              options: classGroups,
            },
            {
              label: 'Instructor',
              value: values.instructorId,
              setValue: (val: string | null) => handleSelectChange('instructorId', val),
              options: instructors,
            },
            {
              label: 'Classroom',
              value: values.classroomId,
              setValue: (val: string | null) => handleSelectChange('classroomId', val),
              options: classrooms,
            },
          ].map((field) => (
            <div key={field.label} className="form-group">
              <label>{field.label}: </label>
              <select
                value={field.value ?? ''}
                onChange={(e) => field.setValue(e.target.value || null)}
                disabled={loading}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={`${field.label}-${option.id}`} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            className="create-button"
            onClick={isEditing ? updateClassSession : createClassSession}
            disabled={loading}
          >
            {isEditing ? 'Save Changes' : 'Create Class Session'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: '8px' }}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSessions;
