import React from 'react';
import './ClassSessions.css';
import { useClassSessions } from '../context/ClassSessionsContext';
import { useComponents } from '../context/ComponentsContext';
import type { ClassSession } from '../types/classSessions';
import { useForm } from '../hooks/useForm';

const ClassSession: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
  const { courses, classGroups, classrooms, instructors } = useComponents();

  const { values, isEditing, editId, handleSelectChange, resetForm, setEditValues } = useForm({
    courseId: null as string | null,
    classGroupId: null as string | null,
    instructorId: null as string | null,
    classroomId: null as string | null,
  });

  const createClassSession = () => {
    if (!values.courseId || !values.classGroupId || !values.instructorId || !values.classroomId) {
      alert('Please fill out all fields before creating a class session.');
      return;
    }

    const newSession: ClassSession = {
      id: crypto.randomUUID(),
      course: courses.find((course) => course.id === values.courseId)!,
      classGroup: classGroups.find((classGroup) => classGroup.id === values.classGroupId)!,
      instructor: instructors.find((instructor) => instructor.id === values.instructorId)!,
      classroom: classrooms.find((classroom) => classroom.id === values.classroomId)!,
    };

    setClassSessions((prevSessions) => [...prevSessions, newSession]);
    resetForm();
  };

  const updateClassSession = () => {
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

    const updatedSession: ClassSession = {
      id: editId,
      course: courses.find((course) => course.id === values.courseId)!,
      classGroup: classGroups.find((classGroup) => classGroup.id === values.classGroupId)!,
      instructor: instructors.find((instructor) => instructor.id === values.instructorId)!,
      classroom: classrooms.find((classroom) => classroom.id === values.classroomId)!,
    };

    setClassSessions((prevSessions) =>
      prevSessions.map((session) => (session.id === updatedSession.id ? updatedSession : session))
    );
    resetForm();
  };

  const removeClassSession = (id: string) => {
    setClassSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
    if (editId === id) resetForm();
  };

  const editClassSession = (id: string) => {
    const session = classSessions.find((s) => s.id === id);
    if (session) {
      setEditValues({
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
          {classSessions.length === 0 ? (
            <p>No class sessions created yet.</p>
          ) : (
            classSessions.map((session) => (
              <div key={`session-${session.id}`} className="class-session">
                <h3>
                  {session.course.name} - {session.classGroup.name}
                </h3>
                <p>Instructor: {session.instructor.name}</p>
                <p>Classroom: {session.classroom.name}</p>
                <div className="buttons">
                  <button onClick={() => removeClassSession(session.id)}>Remove</button>
                  <button onClick={() => editClassSession(session.id)}>Edit</button>
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
          >
            {isEditing ? 'Save Changes' : 'Create Class Session'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ marginLeft: '8px' }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSession;
