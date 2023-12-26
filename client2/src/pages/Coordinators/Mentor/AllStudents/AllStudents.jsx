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
    Badge
} from '@chakra-ui/react';
import Loader from '../../../../components/loader/Loader';
import { ThemeProvider, useTheme } from '../../../../Global/ThemeContext';

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
            var fetched = axios
                .get(url + `/students/all?department=${slugify(current_user.department)}&select=name,mentor,email,isApproved,isActive,hasMentor,div,contact_no,sem,batch,rollno`)
                .then(response => response.data);
            setStudentsNotHavingMentor(0);
            return (
                fetched
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
            <h1 style={{ color: colors.font, fontSize: '23px', margin: '5px 2.5vw', fontWeight: 'bold', textAlign: 'center' }}>Following Students Belong to your Department</h1>
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
                                            <span>{student.rollno} {student.hasMentor && <Badge colorScheme='green'>Assigned</Badge>}</span>
                                        </Box>

                                        <AccordionIcon color={colors.font} />
                                    </AccordionButton>
                                </h2>
                                
                                <AccordionPanel pb={4}>
                                    <div style={{ fontSize: '18px', color: colors.font }}>  {student.name} </div>
                                    <div style={{ fontSize: '17px', color: '#c20010', fontStyle: 'italic', fontWeight: 'bold' }}>{student.email}</div>

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
