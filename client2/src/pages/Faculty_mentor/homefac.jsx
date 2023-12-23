import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../Global/URL';

// Dummy data to simulate the list items
const currentInternships = [
  { id: 1, name: 'John Doe', type: 'Marketing', status: 'Approved', submitted: '1 day ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  // Add more current internship statuses here
];

const internshipsForApproval = [
  { id: 2, name: 'Jane Smith', type: 'Finance', status: 'Not Approved', submitted: '3 days ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  { id: 3, name: 'Alex Johnson', type: 'Design', status: 'Not Approved', submitted: '5 days ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  // Add more internships pending approval here
];

const InternshipPlatform = () => {
  // Function to handle internship approval
  const approveInternship = (internshipId) => {
    console.log(`Internship with ID ${internshipId} approved.`);
    // Here you would typically call a backend service to update the internship status
  };
  const disapproveInternship = (internshipId) => {
    console.log(`Internship with ID ${internshipId} disapproved.`);
    // Here you would typically call a backend service to update the internship status
  };
  const viewUser = () => {
    console.log(`USER`);
    // Here you would typically call a backend service to update the internship status
  };

  const { theme: colors } = useTheme();
  const accessToken = localStorage.getItem('IMPaccessToken');

  const getUser = async () => {
    try {
      const data = await axios.post(url + "/anyuser", { accessToken });
      const user = data.data.msg._doc;
      return user;
    } catch (error) {
      console.log(error);
      localStorage.removeItem('IMPaccessToken');
    }
  }

  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentor_profile_url, setMentorProfilePicture] = useState('');
  const [mentorDepartment, setMentorDepartment] = useState('');
  const [mentorStudents, setMentorStudents] = useState([]);
  const [currentStudents, setCurrentStudents] = useState([]);
  const [studentsForApproval, setStudentsForApproval] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUser();
        if (userInfo) {
          setMentorName(userInfo.name);
          setMentorEmail(userInfo.email);
          setMentorProfilePicture(userInfo.profile_picture_url);
          setMentorDepartment(userInfo.department);
          userInfo.students.forEach(async (student) => {
            const data = {
              email: student.email
            };
            try {
              const response = await fetch(url + "/student/find", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
              if (response.ok) {
                const studentData = await response.json();
                console.log(studentData);
                //have to put approved students into one array and not approved in another
                // var approvedStudentData = [];
                // var notApprovedStudentData = [];
                // if(studentData.isApproved){
                //   // approvedStudentData = [...approvedStudentData, studentData];
                //   // console.log(approvedStudentData);
                //   setCurrentStudents({studentData});
                  
                //   // const updatedCurrentStudents = [...updatedCurrentStudents, studentData];
                //   // setCurrentStudents(updatedCurrentStudents);
                //   // setCurrentStudents(updatedCurrentStudents => [...updatedCurrentStudents, studentData]);
                // }
                // else{
                //   setCurrentStudents(studentData);
                //   // const updatedCurrentStudents = [...updatedCurrentStudents, studentData];
                //   // setCurrentStudents(updatedCurrentStudents => [...updatedCurrentStudents, studentData]);
                // }
                // // setCurrentStudents(approvedStudentData);
                // console.log(currentStudents);
                console.log('Data retrieved from the backend!');
              } else {
                console.error('Failed to retrieve data to the backend.');
              }
            } catch (error) {
              console.error('Error occurred while retrieving data:', error);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const InternshipItem = ({ internship, withButton, onApprove, status, onDisapprove }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 min-w-full mb-4 mt-4" onClick={viewUser}>
        {/* Status and Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          {status && (
            <div className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${internship.status === "Approved" ? "text-green-700" : "text-red-900"} relative`}>{internship.status}</div>
          )}
          <div className="flex space-x-2">
            {withButton && (
              <div className="flex space-x-2 items-end ml-full">
                <button className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-full cursor-pointer" onClick={onApprove}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full cursor-pointer" onClick={onDisapprove}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <img
            src={internship.img}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <div className="text-sm font-semibold">{internship.name}</div>
            <div className="text-xs text-gray-500">Company Name</div>
          </div>
        </div>
      </div>

    );
  };

  return (
    <div className="bg-gray-100 flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4">
      <div className="flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
        <div className="flex flex-row justify-start w-full">
          <img
            src={mentor_profile_url}
            alt="User Profile"
            className="h-10 w-10 rounded-full mr-2"
          />
          <div className="flex flex-1 flex-col items-start justify-start w-full">
            <h1 className="text-base text-black-900 w-full">{mentorName}</h1>
            <p className="text-black-900_7f text-xs w-full">{mentorEmail}</p>
          </div>
        </div>
      </div>

      <h1 className="text-base text-black-900 w-full text-center font-bold">{mentorDepartment}</h1>

      <div className="flex-grow p-4 min-w-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Assigned Students</h2>
          {currentInternships.map((internship) => (
            <InternshipItem key={internship.id} internship={internship} />
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold">New Internship Approvals</h2>
          {internshipsForApproval.map((internship) => (
            <InternshipItem
              key={internship.id}
              internship={internship}
              withButton={true}
              status={true}
              onApprove={() => approveInternship(internship.id)}
              onDisapprove={() => disapproveInternship(internship.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipPlatform;
