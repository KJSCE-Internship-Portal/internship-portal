import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../Global/URL';

const InternshipPlatform = () => {
  const approveStudent = async (studentID, approval) => {
    console.log(`Internship with ID ${studentID} approved.`);
    const data = {
      sub_id: studentID,
      status: approval
    }
    const response = await axios.post(url + `/student/approve`, data);
    window.location.reload();
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

  const fetchData = async () => {
    try {
      const userInfo = await getUser();
      if (userInfo) {
        setMentorName(userInfo.name);
        setMentorEmail(userInfo.email);
        setMentorProfilePicture(userInfo.profile_picture_url);
        setMentorDepartment(userInfo.department);
        const response = await axios
          .get(url + `/students/all?mentor.email=${userInfo.email}`);
        const studentData = response.data.data;
        console.log(studentData);
        setCurrentStudents([]);
        setStudentsForApproval([]);
        studentData.forEach((student) => {
          try {
            if (student) {
              if (student.isApproved) {
                student.isApproved = student.isApproved ? 'Approved' : 'Not Approved';
                setCurrentStudents(prevStudent => [...prevStudent, student]);
              }
              else {
                student.isApproved = student.isApproved ? 'Approved' : 'Not Approved';
                setStudentsForApproval(prevStudent => [...prevStudent, student]);
              }
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

  useEffect(() => {
    setCurrentStudents([]);
    setStudentsForApproval([]);
    fetchData();
  }, []);

  const InternshipItem = ({ student, withButton, onApprove, status, onDisapprove }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 min-w-full mb-4 mt-4">
        {/* Status and Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          {status && (
            <div className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${student.isApproved === "Approved" ? "text-green-700" : "text-red-900"} relative`}>{student.isApproved}</div>
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
        <div className="flex items-center mb-2" onClick={viewUser}>
          <img
            src={student.profile_picture_url}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <div className="text-sm font-semibold">{student.name}</div>
            <div className="text-xs text-gray-500">Company Name {student.internships[0].company}</div>
          </div>
        </div>
      </div>

    );
  };

  return (
    <div className="bg-gray-100 flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4 h-screen">
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
      {/* <h1>{currentStudents[0]}</h1> */}
      <div className="flex-grow p-4 min-w-full">
        {currentStudents && currentStudents.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold">Assigned Students</h2>
            {currentStudents.map((student) => (
              <InternshipItem key={student.sub_id} student={student} />
            ))}
          </div>
        ) : (
          <div className="text-xl font-bold">No students assigned.</div>
        )}

        <div className="border-t border-gray-300 my-4"></div>

        {studentsForApproval && studentsForApproval.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold">New Internship Approvals</h2>
            {studentsForApproval.map((student) => (
              <InternshipItem
                key={student.sub_id}
                student={student}
                withButton={true}
                status={true}
                onApprove={() => approveStudent(student.sub_id, true)}
                onDisapprove={() => approveStudent(student.sub_id, false)}
              />
            ))}
          </div>
        ) : (
          <div className="text-xl font-bold">No new internship approvals.</div>
        )}
      </div>
    </div>
  );
};

export default InternshipPlatform;
