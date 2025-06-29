import React, { useState } from "react";
import "./ClassSessions.css";
import { useClassSessions } from '../context/ClassSessionsContext';
import { useComponents } from '../context/ComponentsContext';
import type { ClassSession } from '../types/classSessions';

const ClassSession: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
  const { courses, classGroups, classrooms, instructors } = useComponents();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);

  // Function to create a new class session
  const createClassSession = () => {
    if (!selectedCourse || !selectedGroup || !selectedInstructor || !selectedClassroom) {
      alert("Please fill out all fields before creating a class session.");
      return;
    }

    const newSession: ClassSession = {
      id: Date.now(),
      course: courses.find(course => course.id === selectedCourse)!,
      group: classGroups.find(group => group.id === selectedGroup)!,
      instructor: instructors.find(instructor => instructor.id === selectedInstructor)!,
      classroom: classrooms.find(classroom => classroom.id === selectedClassroom)!,
    };

    setClassSessions((prevSessions) => [...prevSessions, newSession]);
  };

  // Function to remove a class session
  const removeClassSession = (id: number) => {
    setClassSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== id)
    );
  };

  // Function to edit a class session
  const editClassSession = (id: number) => {
    const session = classSessions.find((s) => s.id === id);
    if (session) {
      setSelectedCourse(session.course.id);
      setSelectedGroup(session.group.id);
      setSelectedInstructor(session.instructor.id);
      setSelectedClassroom(session.classroom.id);
      removeClassSession(id); // Remove the session first, we will add the edited one
    }
  };

  return (
    <div className="container main-flex">
      {/* Class Sessions List Container */}
      <div className="sessions-list-container">
        <h1>Class Session Management</h1>
        <div className="class-sessions">
          <h2>Class Sessions</h2>
          {classSessions.length === 0 ? (
            <p>No class sessions created yet.</p>
          ) : (
            classSessions.map((session, idx) => {
              const sessionKey = `session-${session.id}`; // Unique key for each session
              return (
                <div key={sessionKey} className="class-session">
                  <h3>
                    {session.course.name} - {session.group.name}
                  </h3>
                  <p>Instructor: {session.instructor.name}</p>
                  <p>Classroom: {session.classroom.name}</p>
                  <div className="buttons">
                    <button onClick={() => removeClassSession(session.id)}>Remove</button>
                    <button onClick={() => editClassSession(session.id)}>Edit</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create/Edit Form Container */}
      <div className="form-container">
        <h2>{selectedCourse ? 'Edit Class Session' : 'Create Class Session'}</h2>
        <div className="create-session-form">
          {[
            { label: "Course", value: selectedCourse, setValue: setSelectedCourse, options: courses },
            { label: "Class Group", value: selectedGroup, setValue: setSelectedGroup, options: classGroups },
            { label: "Instructor", value: selectedInstructor, setValue: setSelectedInstructor, options: instructors },
            { label: "Classroom", value: selectedClassroom, setValue: setSelectedClassroom, options: classrooms }
          ].map((field, index) => (
            <div key={field.label || index} className="form-group">
              <label>{field.label}: </label>
              <select
                value={field.value ?? ""} // Ensure value is never NaN, use empty string if null/undefined
                onChange={(e) => field.setValue(Number(e.target.value) || null)} // Handle conversion
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, optionIndex) => {
                  // Combine component type (`field.label`), option `id`, and index to create a unique key
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
          <button className="create-button" onClick={createClassSession}>
            {selectedCourse ? 'Save Changes' : 'Create Class Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassSession;
