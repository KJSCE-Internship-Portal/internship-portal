import React from 'react';
import './Menotroverlay.css';

const handleRegisterClick = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Your existing logic to handle registration
  // ...
};

const handleDeleteClick = async (event) => {
  event.preventDefault(); // Prevent default button click behavior

  // Your existing logic to handle deletion
  // ...
};


const MentorOverlay = ({ student, handleClose }) => {
  return (
    <div className="overlay">
    <div className="mentor-registration">
    <h3 className="text-lg font-bold mb-2">Faculty Mentor Registration</h3>
    <div className="mb-2">
      <label htmlFor="mentorContact" className="block text-sm font-medium text-gray-700">Mentor Contact No.</label>
      <input type="text" id="mentorContact" name="mentorContact" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter contact number" />
    </div>
    <div className="mb-4">
      <label htmlFor="mentorEmail" className="block text-sm font-medium text-gray-700">Mentor Email</label>
      <input type="email" id="mentorEmail" name="mentorEmail" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter email address" />
    </div>
    
    <div className="flex gap-4">
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleRegisterClick}>
        Register
      </button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteClick}>
        Delete
      </button>
    </div>
    </div>
        
        
      </div>

  );
};

export default MentorOverlay;