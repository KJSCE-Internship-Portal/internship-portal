import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { Avatar, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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

  const renderStudentList = (students, department, openDrawer, colors) => {
    const filteredStudents = students.filter((student) => student.department === department);
    const number = filteredStudents.length;
    return (
      <div>
      <p className='mb-4'>
        Number of students in {department} : {number}
      </p>
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <div
              onClick={() => openDrawer(student)} style={{cursor: 'pointer'}}
              className={`bg-gray-400 border border-${colors.accent} border-solid rounded-md flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}
            >
              <div className="flex flex-row justify-start w-full">
                <Avatar size="md" bg="red.700" color="white" name={student.name} src={student.profile_picture_url} className="h-8 w-8 mr-2 mt-0 mb-2"></Avatar>
                <div className="flex flex-1 flex-col items-start justify-start w-full">
                  <h1 className={`text-base text-${colors.font} w-full font-semibold`}>{student.name}</h1>
                  <p className={`text-${colors.font} text-s w-full`}>{student.email}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
    );
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
    <Tabs variant='soft-rounded' isFitted colorScheme='green'>
        <TabList marginX={5} gap={3}>
          <Tab bg={colors.hover} color={colors.font}>COMPS</Tab>
          <Tab bg={colors.hover} color={colors.font}>IT</Tab>
          <Tab bg={colors.hover} color={colors.font}>MECH</Tab>
          <Tab bg={colors.hover} color={colors.font}>EXTC</Tab>
        <Tab bg={colors.hover} color={colors.font}>ETRX</Tab>
        </TabList>
        <TabPanels w={'100%'}>
          <TabPanel>
            {students && renderStudentList(students, "Computer Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {students && renderStudentList(students, "Information Technology", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {students && renderStudentList(students, "Mechanical Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {students && renderStudentList(students, "Electronics & Telecommunication Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {students && renderStudentList(students, "Electronics Engineering", openDrawer, colors)}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <StudentDrawer isOpen={isDrawerOpen} onClose={closeDrawer} studentData={studentData} />
    </div>
  );
};

export default StudentList;
