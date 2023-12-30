import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { Avatar, Button } from '@chakra-ui/react';
import {useTheme} from '../../Global/ThemeContext';
import StudentDrawer from '../Faculty_mentor/studentdrawer';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const {theme:colors} = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);

  const openDrawer = (student) => {
    setStudentData(student);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(url + '/students/all'); 
        setStudents(response.data.data);
        console.log(students);

      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-left justify-start mx-auto w-full max-h-full py-6 px-4 h-screen text-${colors.font}`}>
    <h1 className={`text-xl font-bold mb-5 text-${colors.font}`}>Students List</h1>
      <ul>
        {students.map((student) => (
        <li key={student.id}>
            
          <div onClick={() => openDrawer(student)} className={`bg-gray-400 border border-${colors.accent} border-solid rounded-md flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
            <div className="flex flex-row justify-start w-full">
              <Avatar size="md" bg='red.700' color="white" name={student.name} src={student.profile_picture_url} className="h-8 w-8 mr-2 mt-0 mb-2"></Avatar>
              <div className="flex flex-1 flex-col items-start justify-start w-full">
                <h1 className={`text-base text-${colors.font} w-full font-semibold`}>{student.name}</h1>
                <p className={`text-${colors.font} text-xs w-full`}>{student.email}</p>
              </div>
            </div>
          </div>
          </li>
        ))}
      </ul>
      <StudentDrawer isOpen={isDrawerOpen} onClose={closeDrawer} studentData={studentData} />
    </div>
  );
};

export default StudentList;
