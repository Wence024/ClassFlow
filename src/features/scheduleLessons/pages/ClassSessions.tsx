import React, { useState } from 'react';
// import './ClassSessions.css'; // Remove old CSS
import { useClassSessions } from '../contexts/ClassSessionsContext';
import { useComponents } from '../contexts/ComponentsContext';
import type { ClassSession } from '../types/classSessions';

const ClassSessions: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
  const { courses, classGroups, classrooms, instructors } = useComponents();

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [editingSession, setEditingSession] = useState<boolean>(false);
  const [sessionIdToEdit, setSessionIdToEdit] = useState<number | null>(null); // Store the session ID being edited

  // Function to create a new class session
  const createClassSession = () => {
    if (!selectedCourse || !selectedGroup || !selectedInstructor || !selectedClassroom) {
      alert('Please fill out all fields before creating a class session.');
      return;
    }

    const newSession: ClassSession = {
      id: Date.now(),
      course: courses.find((course) => course.id === selectedCourse)!,
      group: classGroups.find((group) => group.id === selectedGroup)!,
      instructor: instructors.find((instructor) => instructor.id === selectedInstructor)!,
      classroom: classrooms.find((classroom) => classroom.id === selectedClassroom)!,
    };

    setClassSessions((prevSessions) => [...prevSessions, newSession]);
    resetForm(); // Reset form after creating a session
  };

  // Function to remove a class session
  const removeClassSession = (id: number) => {
    setClassSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
  };

  // Function to edit a class session
  const editClassSession = (id: number) => {
    const session = classSessions.find((s) => s.id === id);
    if (session) {
      setSelectedCourse(session.course.id);
      setSelectedGroup(session.group.id);
      setSelectedInstructor(session.instructor.id);
      setSelectedClassroom(session.classroom.id);
      setEditingSession(true); // Switch to edit mode
      setSessionIdToEdit(id); // Store the ID of the session being edited
    }
  };

  // Reset the form to "Create" mode
  const resetForm = () => {
    setSelectedCourse(null);
    setSelectedGroup(null);
    setSelectedInstructor(null);
    setSelectedClassroom(null);
    setEditingSession(false); // Reset edit mode
    setSessionIdToEdit(null); // Reset the session ID to edit
  };

  // Handle save changes (either create or update)
  const saveClassSession = () => {
    if (editingSession && sessionIdToEdit !== null) {
      // Update the class session
      const updatedSession: ClassSession = {
        id: sessionIdToEdit, // Use the ID of the session being edited
        course: courses.find((course) => course.id === selectedCourse)!,
        group: classGroups.find((group) => group.id === selectedGroup)!,
        instructor: instructors.find((instructor) => instructor.id === selectedInstructor)!,
        classroom: classrooms.find((classroom) => classroom.id === selectedClassroom)!,
      };

      setClassSessions((prevSessions) =>
        prevSessions.map((session) => (session.id === updatedSession.id ? updatedSession : session))
      );
    } else {
      createClassSession(); // Call create session function if in "create" mode
    }

    resetForm(); // Reset after saving changes (create or edit)
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      {/* Class Sessions List Container */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-center mb-6">Class Session Management</h1>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Class Sessions</h2>
          {classSessions.length === 0 ? (
            <p className="text-gray-500">No class sessions created yet.</p>
          ) : (
            classSessions.map((session) => {
              const sessionKey = `session-${session.id}`; // Unique key for each session
              return (
                <div
                  key={sessionKey}
                  className="bg-gray-50 p-4 mb-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">
                      {session.course.name} - {session.group.name}
                    </h3>
                    <p className="text-gray-700">Instructor: {session.instructor.name}</p>
                    <p className="text-gray-700">Classroom: {session.classroom.name}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => removeClassSession(session.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => editClassSession(session.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create/Edit Form Container */}
      <div className="w-full md:w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editingSession ? 'Edit Class Session' : 'Create Class Session'}
        </h2>
        <div className="bg-white p-6 rounded-lg shadow">
          {[
            {
              label: 'Course',
              value: selectedCourse,
              setValue: setSelectedCourse,
              options: courses,
            },
            {
              label: 'Class Group',
              value: selectedGroup,
              setValue: setSelectedGroup,
              options: classGroups,
            },
            {
              label: 'Instructor',
              value: selectedInstructor,
              setValue: setSelectedInstructor,
              options: instructors,
            },
            {
              label: 'Classroom',
              value: selectedClassroom,
              setValue: setSelectedClassroom,
              options: classrooms,
            },
          ].map((field, index) => (
            <div key={field.label || index} className="mb-4">
              <label className="block font-semibold mb-1">{field.label}:</label>
              <select
                value={field.value ?? ''}
                onChange={(e) => field.setValue(Number(e.target.value) || null)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, optionIndex) => {
                  const optionKey = `${field.label.toLowerCase()}-${option.id}-${optionIndex}`;
                  return (
                    <option key={optionKey} value={option.id}>
                      {option.name}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
          <button
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold mt-2"
            onClick={saveClassSession}
          >
            {editingSession ? 'Save Changes' : 'Create Class Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassSessions;
