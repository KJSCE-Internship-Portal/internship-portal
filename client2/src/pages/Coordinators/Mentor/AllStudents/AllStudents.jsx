import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../../Global/URL';
import { getUserDetails } from '../../../../Global/authUtils';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Badge,
    SimpleGrid
} from '@chakra-ui/react';
import Loader from '../../../../components/loader/Loader';
import { useTheme } from '../../../../Global/ThemeContext';
import { Avatar } from '@chakra-ui/react';
import AssignedStudentsPie from '../../Statistic_Components/AssignedStudentsPie';
import CompletedStudentsAndVerified from '../../Statistic_Components/CompletedStudents';
import { CompanyProvidingInternships } from '../../Statistic_Components/CompanyProvidingInternships';

const getRandomLightColor = () => {

    const r = Math.floor(Math.random() * 128) + 128; // Red component
    const g = Math.floor(Math.random() * 128) + 128; // Green component
    const b = Math.floor(Math.random() * 128) + 128; // Blue component
  
    // Convert RGB values to hexadecimal and concatenate
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  
    return color;
  };

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')    // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove non-word characters
        .replace(/--+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '');     // Trim - from end of text
};

const AllStudentsInDepartment = () => {
    const { department } = useParams();
    const [user, setUser] = useState(false);
    const { theme: colors } = useTheme();
    const [studentsnothavingmentor, setStudentsNotHavingMentor] = useState(0);

    const { isError, isLoading, data } = useQuery({
        queryKey: ['/students/all'],
        retryDelay: 10000,
        queryFn: async () => {
            if (!user) {
                var current_user = await getUserDetails();
                setUser(current_user);
            } else {
                var current_user = user;
            }
            var fetched = await axios
                .get(url + `/students/all?department=${slugify(current_user.department)}&select=name,mentor,email,isApproved,isActive,hasMentor,div,contact_no,sem,batch,rollno,profile_picture_url`)
                .then(response => response.data);
            setStudentsNotHavingMentor(0);
            return (
                fetched
            );
        }
    });

    const {data: pie_data } = useQuery({
        queryKey: ['/statistics/department'],
        retryDelay: 10000,
        queryFn: async () => {
            if (!user) {
                var current_user = await getUserDetails();
                setUser(current_user);
            } else {
                var current_user = user;
            }
            var fetched = await axios
                .post(url + `/coordinator/statistics`, {department: current_user.department})
                .then(response => response.data);
            console.log(fetched.data);
            setStudentsNotHavingMentor(0);
            return (
                fetched.data
            );
        }
    });

    if (isError) {
        return (
            <h1>Error</h1>
        );
    }

    if (isLoading) {
        return (
            <Loader />
        );
    }


    return (
        <div>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
            <Box mt={10}>
          <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={20} marginBottom={10}>
            {/* Charts */}
            <Box bg="white" p={4} shadow="md" borderRadius="md" bgColor={colors.secondary}>
            {pie_data  &&
                <AssignedStudentsPie assigned={pie_data.assignedStudents} notAssigned={pie_data.studentsInDepartment-pie_data.assignedStudents}/>}
            </Box>
            <Box bg="white" p={4} shadow="md" borderRadius="md" bgColor={colors.secondary}>
            {pie_data && pie_data.completedStudentsAndVerified!=(pie_data.assignedStudents-pie_data.completedStudentsAndVerified)!=0 && 
                <CompletedStudentsAndVerified completed={pie_data.completedStudentsAndVerified} notCompleted={pie_data.assignedStudents-pie_data.completedStudentsAndVerified}/>
                }
            </Box>

          </SimpleGrid>
        </Box>
                {/* {pie_data  &&
                <AssignedStudentsPie assigned={pie_data.assignedStudents} notAssigned={pie_data.studentsInDepartment-pie_data.assignedStudents}/>}
                {pie_data && pie_data.completedStudentsAndVerified!=(pie_data.assignedStudents-pie_data.completedStudentsAndVerified)!=0 && 
                <CompletedStudentsAndVerified completed={pie_data.completedStudentsAndVerified} notCompleted={pie_data.assignedStudents-pie_data.completedStudentsAndVerified}/>
                } */}

            </div>
            {/* <h1 style={{ color: colors.font, fontSize: '23px', margin: '5px 2.5vw', fontWeight: 'bold', textAlign: 'center' }}>Following Students Belong to your Department</h1> */}
            {/* {JSON.stringify(data.data)} */}

            <h2 style={{ color: colors.primary, fontSize: '20px', margin: '5px 3vw', fontWeight: 'bold' }}>Students</h2>

            <Accordion allowToggle padding={'1.5vw'}>

                {data.success && data.data.map((student) => {
                    if (student.isActive) {
                        return (
                            <AccordionItem border='none' key={student.email}>
                                <h2>
                                    <AccordionButton _expanded={{ bg: colors.hover, color: 'white' }}>
                                        <Box as="span" flex='1' textAlign='left' style={{ color: colors.font, fontSize: '20px' }}>
                                        <Avatar h={30} w={30} mr={5} src={student.profile_picture_url} />
                                        <span style={{marginTop: '10px', height: '100%'}} >{student.name}</span>
                                        <span style={{display: 'block',marginTop: '10px', height: '100%'}} >{student.rollno} &nbsp;&nbsp; {student.hasMentor && <Badge colorScheme='green'>Assigned</Badge>}</span>
                                        </Box>

                                        <AccordionIcon color={colors.font} />
                                    </AccordionButton>
                                </h2>
                                
                                <AccordionPanel pb={4}>
                                    <div style={{ fontSize: '18px', color: colors.primary }}>  Semester: {student.sem}, Batch: {student.batch} </div>
                                    <div style={{ fontSize: '17px', color: colors.heading1, fontStyle: 'italic', fontWeight: 'bold' }}>{student.email}</div>

                                    {student.hasMentor && <div style={{ borderRadius: '10px', margin: '5px 0', backgroundColor: colors.hover, padding: '5px 1.5vw', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ color: colors.font }}>Mentor Details :</div>
                                        <div style={{ height: '10px' }}></div>
                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Name:</span> {student.mentor.name}</div>

                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Email:</span> {student.mentor.email}</div>
                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Contact No. :</span> {student.mentor.contact_no}</div>

                                    </div>}

                                </AccordionPanel>
                            </AccordionItem>
                        )
                    }
                })}
                {data.data.length <= 0 && <div style={{ backgroundColor: colors.hover, height: '150px', width: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                    <h1 style={{ color: colors.font, textAlign: 'center' }}>No Students Here</h1>
                </div>}
            </Accordion>

            {/* <h2 style={{ color: colors.primary, fontSize: '20px', margin: '5px 3vw', fontWeight: 'bold' }}>Students having no Mentors</h2>

            <Accordion allowToggle padding={'1.5vw'}>

                {data.success && data.data.map((student) => {
                    if (student.isActive && !student.hasMentor) {
                        setStudentsNotHavingMentor((studentsnothavingmentor) => studentsnothavingmentor + 1)
                        return (
                            <AccordionItem border='none' key={student.email}>
                                <h2>
                                    <AccordionButton _expanded={{ bg: colors.hover, color: 'white' }}>
                                        <Box as="span" flex='1' textAlign='left' style={{ color: colors.font, fontSize: '20px' }}>
                                            <span>{student.rollno}</span>
                                        </Box>

                                        <AccordionIcon color={colors.font} />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <div style={{ fontSize: '18px', color: colors.font }}>  {student.name} <Badge colorScheme='green'>Approved</Badge> </div>
                                    <div style={{ fontSize: '17px', color: '#c20010', fontStyle: 'italic', fontWeight: 'bold' }}>{student.email}</div>

                                    <div style={{ borderRadius: '10px', margin: '5px 0', backgroundColor: colors.hover, padding: '5px 1.5vw', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ color: colors.font }}>Mentor Details :</div>
                                        <div style={{ height: '10px' }}></div>
                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Name:</span> {student.mentor.name}</div>

                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Email:</span> {student.mentor.email}</div>
                                        <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Contact No. :</span> {student.mentor.contact_no}</div>

                                    </div>

                                </AccordionPanel>
                            </AccordionItem>
                        )
                    }
                })
                }
                {
                    studentsnothavingmentor <= 0 &&
                    <div style={{ backgroundColor: colors.hover, height: '150px', width: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                        <h1 style={{ color: colors.font, textAlign: 'center' }}>No Students Here</h1>
                    </div>
                }

            </Accordion> */}

        </div>
    )
}

export default AllStudentsInDepartment;
