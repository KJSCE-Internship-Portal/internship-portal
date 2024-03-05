import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardFooter, Avatar, AvatarBadge } from '@chakra-ui/react'
import { url, c_url } from '../../Global/URL';
import StudentDrawer from './studentdrawer.jsx';
import MentorDrawer from '../Admin/mentordrawer.jsx';

const InternshipPlatform = () => {
  const approveStudent = async (studentID, approval, mentorEmail) => {
    const data = {
      sub_id: studentID,
      status: approval,
      email: mentorEmail,
    }
    const response = await axios.post(url + `/student/approve`, data);
    if (approval) {
      showToast(toast, 'Success', 'success', 'Student Approved');
    } else {
      showToast(toast, 'Success', 'success', 'Student Rejected');
    }
    fetchData();
  };
  const viewUser = (studentData) => {
    setStudentData(studentData);
    setIsDrawerOpen(true);
  };
  const trackUser = (studentInfo) => {
    console.log(`APPROVED USER`);
    localStorage.setItem('student', studentInfo);
    window.location.href = c_url + 'mentor/studentprogress';
  }

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

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer2 = () => {
    setIsDrawerOpen2(true);
  };

  const closeDrawer2 = () => {
    setIsDrawerOpen2(false);
  };

  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentor_profile_url, setMentorProfilePicture] = useState('');
  const [mentorDepartment, setMentorDepartment] = useState('');
  // const [mentorStudents, setMentorStudents] = useState([]);
  const [currentStudents, setCurrentStudents] = useState([]);
  const [studentsForApproval, setStudentsForApproval] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [isDrawerOpen2, setIsDrawerOpen2] = useState(false);
  const [mentorData, setMentorData] = useState([]);

  const toast = useToast();

  const fetchData = async () => {
    try {
      const userInfo = await getUser();
      if (userInfo) {
        localStorage.removeItem('student');
        setMentorName(userInfo.name);
        setMentorEmail(userInfo.email);
        setMentorProfilePicture(userInfo.profile_picture_url);
        setMentorDepartment(userInfo.department);
        setMentorData(userInfo);
        const response = await axios
          .get(url + `/students/all?mentor.email=${userInfo.email}`);
        const studentData = response.data.data;
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

      <div>
        <Card className={`bg-white rounded-lg shadow-md p-4 min-w-full mb-4 mt-4 transform transition-transform hover:translate-y-[-2px] hover:shadow-md text-${colors.font}`}>
          {/* Status and Action Buttons */}
          <div className="flex justify-between items-center mb-4">
            {status && (
              <div className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${student.isApproved === "Approved" ? `text-green-700` : `text-red-900`} relative`}>
                {student.isApproved}
              </div>
            )}
            <div className="flex space-x-2">
              {withButton && (
                <div className="flex space-x-2 items-end ml-full">
                  <button className={`w-8 h-8 flex items-center justify-center bg-green-500 rounded-full cursor-pointer text-${colors.font}`} onClick={onApprove}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button className={`w-8 h-8 flex items-center justify-center bg-red-500 rounded-full cursor-pointer text-${colors.font}`} onClick={onDisapprove}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center mb-2" onClick={() => (status === true ? viewUser(student) : trackUser(student.sub_id))}>
            <Avatar size="md" bg='red.700' color="white" name={student.name} src={student.profile_picture_url} className="h-10 w-10 mr-2"></Avatar>
            <div>
              <div className="text-sm font-semibold">{student.name}</div>
              <div className="text-xs text-gray-500">Company Name {student.internships[0].company}</div>
            </div>
          </div></Card>
      </div>

    );
  };

  return (
    <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4 h-screen text-${colors.font}`}>
      <div className="flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
        <div className="flex flex-row justify-start w-full">
          <Avatar size="md" bg='red.700' color="white" name={mentorName} src={mentor_profile_url} className="h-10 w-10 mr-2"></Avatar>
          <div className="flex flex-1 flex-col items-start justify-start w-full">
            <h1 className={`text-base text-${colors.font} w-full font-semibold`}>{mentorName}</h1>
            <p className={`text-${colors.font} text-xs w-full`}>{mentorEmail}</p>
          </div>
          <button className="bg-red-500 hover hover:bg-red-800 text-white px-4 py-2 rounded-md" onClick={openDrawer2}>
              View Profile</button>
        </div>
      </div>
      <MentorDrawer isOpen={isDrawerOpen2} onClose={closeDrawer2} mentorData={mentorData} />
      <h1 className={`text-base text-${colors.font} w-full text-center font-bold`}>{mentorDepartment}</h1>
      {/* <h1>{currentStudents[0]}</h1> */}
      <div className="flex-grow p-4 min-w-full">
        {currentStudents && currentStudents.length > 0 ? (
          <div className="mb-8">
            <h2 className={`text-xl font-bold text-${colors.font}`}>Assigned Students</h2>
            {currentStudents.map((student) => (
              <InternshipItem key={student.sub_id} student={student} />
            ))}
          </div>
        ) : (
          <div className={`text-xl font-bold text-${colors.font}`}>No students assigned.</div>
        )}

        <div className="border-t border-gray-300 my-4"></div>

        {studentsForApproval && studentsForApproval.length > 0 ? (
          <div className="mb-8">
            <h2 className={`text-xl font-bold text-${colors.font}`}>New Internship Approvals</h2>
            {studentsForApproval.map((student) => (
              <InternshipItem
                key={student.sub_id}
                student={student}
                withButton={true}
                status={true}
                onApprove={() => approveStudent(student.sub_id, true, student.mentor.email)}
                onDisapprove={() => approveStudent(student.sub_id, false, student.mentor.email)}
              />
            ))}
          </div>
        ) : (
          <div className="text-xl font-bold">No new internship approvals.</div>
        )}
      </div>
      <StudentDrawer isOpen={isDrawerOpen} onClose={closeDrawer} studentData={studentData} />
    </div>
  );
};

export default InternshipPlatform;
