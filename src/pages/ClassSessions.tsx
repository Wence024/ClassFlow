import React, { useState } from "react";
import "./ClassSessions.css";
import { useClassSessions } from '../context/ClassSessionsContext';
import { courses, classGroups, classrooms, instructors } from '../context/ClassSessionsData';
import type { ClassSession } from '../context/ClassSessionsData';

// App Component
const ClassSession: React.FC = () => {
  const { classSessions, setClassSessions } = useClassSessions();
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
            classSessions.map((session) => (
              <div key={session.id} className="class-session">
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
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Form Container */}
      <div className="form-container">
        <h2>{selectedCourse ? 'Edit Class Session' : 'Create Class Session'}</h2>
        <div className="create-session-form">
          <div className="form-group">
            <label>Course: </label>
            <select
              value={selectedCourse ?? ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Class Group: </label>
            <select
              value={selectedGroup ?? ""}
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
            >
              <option value="">Select Group</option>
              {classGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Instructor: </label>
            <select
              value={selectedInstructor ?? ""}
              onChange={(e) => setSelectedInstructor(Number(e.target.value))}
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Classroom: </label>
            <select
              value={selectedClassroom ?? ""}
              onChange={(e) => setSelectedClassroom(Number(e.target.value))}
            >
              <option value="">Select Classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>
          <button className="create-button" onClick={createClassSession}>
            {selectedCourse ? 'Save Changes' : 'Create Class Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassSession;
