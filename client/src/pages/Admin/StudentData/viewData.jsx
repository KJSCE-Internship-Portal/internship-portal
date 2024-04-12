import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../../Global/URL';
import { getUserDetails } from '../../../../Global/authUtils';
import {
    Box,
    Badge,
    SimpleGrid,
    Divider,
    AbsoluteCenter,
    Table,
    Tbody,
    Tr,
    Td,
    Avatar,
    Thead,
    Th,
    chakra,
    Tabs,
    TabPanel

} from '@chakra-ui/react';
import Loader from '../../../../components/loader/Loader';
import { useTheme } from '../../../../Global/ThemeContext';
import AssignedStudentsPie from '../../Statistic_Components/AssignedStudentsPie';
import CompletedStudentsAndVerified from '../../Statistic_Components/CompletedStudents';
import { CompanyProvidingInternships } from '../../Statistic_Components/CompanyProvidingInternships';
import { BarChart } from '../../Statistic_Components/BarChart';
import ExportToExcelButton from './ExportToExcelButton';

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

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

const AllStudentsInDepartment = () => {

    const { department } = useParams();
    const [user, setUser] = useState(false);
    const { theme: colors } = useTheme();
    const [studentsnothavingmentor, setStudentsNotHavingMentor] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [excel_data, setExcelData] = useState([]);
    const [batchFilter, setBatchFilter] = useState("");
    // const [selectedBatch, setSelectedBatch] = useState(null);

    const handleRowClick = (student) => {
        setSelectedStudent(student === selectedStudent ? null : student);
    };

    const HoverableTr = chakra('tr', {
        baseStyle: {
            transition: 'transform 0.3s',
            '&:hover': {
                // transform: 'scale(1.01)',
                backgroundColor: colors.hover,
                cursor: 'pointer'
            },
        },
    });

    const { isError, isLoading, data } = useQuery({
        queryKey: ['/students/all'],
        retryDelay: 10000,
        retry: false,
        queryFn: async () => {
          if (!user) {
            var current_user = await getUserDetails();
            setUser(current_user);
          } else {
            var current_user = user;
          }
          var fetched = await axios
            .get(url + `/students/all?department=${slugify(current_user.department)}&sort=-hasMentor,rollno`)
            .then(response => response.data);
          setStudentsNotHavingMentor(0);
          console.log(fetched.data[0]);
          var complete_data = [];
          
          for (let z = 0; z < fetched.data.length; z++) {
            var student = fetched.data[z];
            if (student.isActive) {
              var c = 0;
              for (let i = 0; i < student.internships[0].progress.length; i++) {
                if (student.internships[0].progress[i].submitted) {
                  c++;
                }
              }
              var excel_obj = {
                Roll_no: student.rollno,
                Name: student.name,
                Batch: student.batch,
                Email: student.email,
                Contact_no: student.contact_no,
                Mentor: student.hasMentor ? student.mentor.name : "-",
                Company: student.internships[0].company,
                Job_Description: student.internships[0].job_description,
                Company_Mentor: student.internships[0].company_mentor,
                Start_Date: formatDate(student.internships[0].startDate),
                End_Date: formatDate(student.internships[0].endDate),
                Total_Weeks: (student.internships[0].duration_in_weeks).toString(),
                Submitted_Weeks: c.toString() + "/" + (student.internships[0].duration_in_weeks).toString(),
                ISE_evaluation_status: (student.internships[0].evaluation[0]?.is_signed) ? 'Completed' : 'Pending',
                ESE_evaluation_status: (student.internships[0].evaluation[1]?.is_signed) ? 'Completed' : 'Pending',
              }
              complete_data.push(excel_obj);
            }
          }
    
            setExcelData(complete_data);
          return fetched;
        },
      });
      
      const filterStudents = (students) => {
        if (!students || !batchFilter) {
            return students;
        }
        return students.filter(student => student.batch === batchFilter);
    };
    

    const filteredStudents = filterStudents(data?.data);

    const { data: pie_data } = useQuery({
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
                .post(url + `/coordinator/statistics`, { department: current_user.department })
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
            <h1 style={{ color: colors.primary, fontSize: '23px', margin: '15px 3vw 0 3vw', fontWeight: 'bold', textAlign: 'center' }}>Department Stats</h1>
            <div style={{ margin: '0 3vw', textAlign: 'right' }}>
                <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                    <option value="">All Batches</option>
                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                    <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
                </select>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>

                <Box mt={10}>
                    {/* {pie_data && <BarChart distribution={pie_data.batchWiseDistribution}/>} */}
                    <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={20} marginBottom={10}>

                        <Box bg="white" p={4} shadow="md" borderRadius="md" bgColor={colors.secondary}>
                            {pie_data &&
                                <AssignedStudentsPie assigned={pie_data.assignedStudents} notAssigned={pie_data.studentsInDepartment - pie_data.assignedStudents} />}
                        </Box>
                        <Box bg="white" p={4} shadow="md" borderRadius="md" bgColor={colors.secondary}>
                            {pie_data && pie_data.assignedStudents != 0 &&
                                <CompletedStudentsAndVerified completed={pie_data.completedStudentsAndVerified} notCompleted={pie_data.assignedStudents - pie_data.completedStudentsAndVerified} />
                            }
                        </Box>

                    </SimpleGrid>
                </Box>


            </div>
            <Box position='relative' padding='9'>
                <Divider color={colors.heading1} />
                <AbsoluteCenter px='10' color={'#fff'} bg={colors.hover} py={'1'} style={{ borderRadius: '10px' }}>
                    Students
                </AbsoluteCenter>
            </Box>
            {/* <ExportToExcelButton excelData={excel_data} department={user ? slugify(user.department) : "data"}/> */}
            <ExportToExcelButton excelData={filteredStudents} department={user ? slugify(user.department) : "data"} batch={batchFilter} />

            <div style={{ maxWidth: '100%', overflowY: 'auto' }}>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th style={{ color: colors.font }}>Roll no.</Th>
                            <Th style={{ color: colors.font }}>Name</Th>
                            <Th style={{ color: colors.font }}>Batch</Th>
                            <Th style={{ color: colors.font }}>E-mail</Th>
                            <Th style={{ color: colors.font }} isNumeric>
                                Contact
                            </Th>
                            <Th style={{ color: colors.font }} isNumeric>Submission Status</Th>
                            <Th style={{ color: colors.font }} >ISE</Th>
                            <Th style={{ color: colors.font }} >ESE</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {/* {data.success && */}
                            {filteredStudents && filteredStudents.map((student) => {
                                
                                if (student.isActive) {
                                    var c = 0;
                                    for (let i = 0; i<student.internships[0].progress.length; i++){
                                        if (student.internships[0].progress[i].submitted){
                                            c++;
                                        }
                                    }
                                    // var excel_obj = 
                                    //     {
                                    //         Roll_no: student.rollno,
                                    //         Name: student.name,
                                    //         Batch: student.batch,
                                    //         Email: student.email,
                                    //         Contact_no: student.contact_no,
                                    //         Weekly_Submissions: c.toString() + "/" + (student.internships[0].duration_in_weeks).toString(),
                                    //         ISE_evaluation_status: student.internships[0].completion.length === 1 ? 'Completed' : 'Pending',
                                    //         ESE_evaluation_status: student.internships[0].completion.length === 2 ? 'Completed' : 'Pending',
                                    //     }
                                    // setExcelData((x)=> [...x, excel_obj]);
                                    
                                    return (
                                        <React.Fragment key={student.email} id={student.rollno}>
                                            <HoverableTr
                                                onClick={() => handleRowClick(student)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Td style={{ color: colors.font }}>{student.rollno}</Td>
                                                <Td style={{ color: colors.font }}>{student.name}</Td>
                                                <Td style={{ color: colors.font }}>{student.batch}</Td>
                                                <Td style={{ color: colors.font }}>{student.email}</Td>
                                                <Td style={{ color: colors.font }} isNumeric>
                                                    {student.contact_no}
                                                </Td>
                                                <Td style={{ color: colors.font }} isNumeric>
                                                    {c}/{student.internships[0].duration_in_weeks}
                                                </Td>
                                                <Td style={{ color: student.internships[0].evaluation[0]?.is_signed ? colors.primary : colors.heading1 }}>
                                                    {student.internships[0].evaluation[0]?.is_signed ? 'Completed' : 'Pending'}
                                                </Td>

                                                <Td style={{ color: student.internships[0].evaluation[1]?.is_signed ? colors.primary : colors.heading1 }}>
                                                    {student.internships[0].evaluation[1]?.is_signed ? 'Completed' : 'Pending'}
                                                </Td>

                                            </HoverableTr>
                                            {selectedStudent === student && (
                                                <Tr>
                                                    <Td colSpan="5">
                                                        <Box
                                                            width="100%"
                                                            mt="2"
                                                            p="4"
                                                            bg={colors.secondary}
                                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', height: 'auto' }}
                                                        >
                                                            <div style={{ marginBottom: '10px' }}>
                                                                {student.hasMentor && <Badge mb={2} colorScheme='green'>Assigned</Badge>}

                                                                <div style={{ fontSize: '17px', color: colors.heading1, fontStyle: 'italic', fontWeight: 'bold', marginBottom: '5px' }}><Avatar h={5} w={5} mr={2} src={student.profile_picture_url} />{student.email}</div>
                                                                <div style={{ fontSize: '18px', color: colors.primary, fontWeight: 'bold' }}>  Semester: {student.sem}, Batch: {student.batch} </div>
                                                                {student.hasMentor && <div style={{ borderRadius: '10px', margin: '5px 0', backgroundColor: colors.secondary2, padding: '5px 1.5vw', display: 'flex', flexDirection: 'column' }}>
                                                                    <div style={{ color: colors.font }}>Mentor Details :</div>
                                                                    <div style={{ height: '10px' }}></div>
                                                                    <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Name:</span> {student.mentor.name}</div>

                                                                    <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Email:</span> {student.mentor.email}</div>
                                                                    <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Contact No. :</span> {student.mentor.contact_no}</div>

                                                                </div>}
                                                                <div style={{ borderRadius: '10px', margin: '5px 0', backgroundColor: colors.secondary2, padding: '5px 1.5vw', display: 'flex', flexDirection: 'column' }}>
                                                                <div style={{ color: colors.font }}>Company Details :</div>
                                                                <div style={{ height: '10px' }}></div>
                                                                    <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Name:</span> {student.internships[0].company}</div>
                                                                    <div style={{ fontSize: '17px', color: colors.font, fontWeight: 'bold' }}><span style={{ color: colors.primary }}>Description:</span> {student.internships[0].job_description}</div>
                                                                </div>
                                                            </div>
                                                        </Box>
                                                    </Td>
                                                </Tr>
                                            )}

                                        </React.Fragment>

                                    );
                                }
                                return null;
                            })}
                    </Tbody>
                </Table>
            </div>
        </div>
    )
}

export default AllStudentsInDepartment;
