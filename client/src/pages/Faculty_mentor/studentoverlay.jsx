import React from 'react';
import './StudentDetailsOverlay.css';
const StudentDetailsOverlay = ({ student, handleClose }) => {
  return (
    <div className="overlay">
          <div className="student-details">
        <h2 className="text-xl font-bold mb-2">{student.name}</h2>
        <p className="text-sm mb-1">Email: {student.email}</p>
        <p className="text-sm mb-1">Division: {student.division}</p>
        <p className="text-sm mb-1">Department: {student.department}</p>
        <p className="text-sm mb-1">Roll Number: {student.rollno}</p>
        <p className="text-sm mb-1">Batch: {student.batch}</p>
        <p className="text-sm mb-1">Semester: {student.semester}</p>
        <p className="text-sm mb-1">Contact: {student.contact_no}</p>
        <p className="text-sm mb-1">Has Mentor: {student.hasMentor ? 'Yes' : 'No'}</p>
        {student.hasMentor && (
          <div>
            <p className="text-sm mb-1">Mentor Name: {student.mentor.name}</p>
            <p className="text-sm mb-1">Mentor Email: {student.mentor.email}</p>
            <p className="text-sm mb-1">Mentor Contact: {student.mentor.contact_no}</p>
          </div>
        )}
        <button
          onClick={handleClose}
          className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentDetailsOverlay;