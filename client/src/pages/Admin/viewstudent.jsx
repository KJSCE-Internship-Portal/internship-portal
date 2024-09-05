import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { Avatar, Button, Tab, TabList, TabPanel, TabPanels, Tabs, Select } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import ExportToExcelButton from './StudentData/ExportToExcelButton';
import {useTheme} from '../../Global/ThemeContext';
import StudentDrawer from '../Faculty_mentor/studentdrawer';
import { useNavigate } from "react-router-dom";
import {DownloadIcon} from "@chakra-ui/icons";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const {theme:colors} = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [selectBatch, setSelectBatch] = useState("2025");
  const [excelData, setExcelData] = useState();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);


  const DownloadModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} mb={4}>
          <option value="ALL" >ALL Departments</option>
          <option value="Computer Engineering">COMPS</option>
          <option value="Information Technology">IT</option>
          <option value="Mechanical Engineering">MECH</option>
          <option value="Electronics And Telecommunication Engineering">EXTC</option>
          <option value="Electronics Engineering">ETRX</option>
          <option value="Electronics And Computer Engineering" hidden>EXCP</option>
          <option value="Robotics And Artificial Intelligence" hidden>RAI</option>
          <option value="Artificial Intelligence And Data Science" hidden>AIDS</option>
          <option value="Computer And Communication Engineering" hidden>CCE</option>
          </Select>

          <Select value={selectBatch} onChange={(e) => setSelectBatch(e.target.value)} mb={4}>
              <option value="" selected disabled>Select Batch</option>
              <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
              <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
            {/* <option value="B3">B3</option> */}
          </Select>
        
        </ModalBody>
        <ModalFooter>
        <ExportToExcelButton excelData={students} department={selectedOption} batch={selectBatch}/>
        </ModalFooter>
      </ModalContent>
    </Modal>
    );
  };

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
    <div>
    <h1 className={`text-xl font-bold mb-5 text-${colors.font}`}>Students List <DownloadIcon style={{marginLeft: '10px', cursor: 'pointer'}} onClick={onOpen}/></h1> 
    <DownloadModal/>
    
    </div>
    
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
            {students && renderStudentList(students, "Electronics And Telecommunication Engineering", openDrawer, colors)}
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
