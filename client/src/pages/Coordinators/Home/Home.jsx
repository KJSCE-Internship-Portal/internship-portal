import React, { useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { useTheme } from '../../../Global/ThemeContext';
import styles from './Home.module.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { url } from '../../../Global/URL';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../../../Global/authUtils';
import RegisterMentor from '../Mentor/RegisterMentor/RegisterMentor';
import AddStudents from '../Mentor/RegisterMentor/AddStudents'
import { LinkIcon } from '@chakra-ui/icons';
import { Box, Divider, AbsoluteCenter } from "@chakra-ui/react";

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

const HomePage = () => {
    const { theme: colors } = useTheme();
    const [user, setUser] = useState(false);

    const { isError, isLoading, data } = useQuery({
        queryKey: ['/mentors/all'],
        retryDelay: 5000,
        queryFn: async () => {

            if (!user) {
                var current_user = await getUserDetails();
                setUser(current_user);
            } else {
                var current_user = user;
            }
            console.log(current_user.department);
            const temp = await axios
                .get(url + `/mentors/all?department=${slugify(current_user.department)}`)
                .then(response => response.data);
            console.log(temp);
            return (temp);
        }
    });

    const navigateToStudentsList = (department) => {
        window.location.href = `/coordinator/${slugify(department)}/all-students`;
    }


    const MentorComponent = ({ name, profile_picture_url, sub_id, students }) => (
        <Link to={`/coordinator/mentor/${sub_id}/students`}>
            <div className={styles.mentorCard}>
                <span className={styles.profilePicContainer}>
                    <img src={profile_picture_url} alt={`${name}'s photo`} className={styles.profilePic} />
                </span>
                <h1 style={{ color: colors.font, margin: '5px 8px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>{name}</h1>
                <h1 style={{ color: colors.primary, margin: '5px 8px', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                    {students.length > 0 ? `Mentoring ${students.length} students` : 'Faculty'}
                </h1>

            </div>
        </Link>
    );

    const MentorList = ({ mentors }) => (
        <>
            <div className={styles.mentorContainer}>
                {mentors.filter(mentor => mentor.students.length > 0).map(mentor => (
                    <MentorComponent key={mentor.sub_id} {...mentor} />
                ))}

            </div>
            <Box position='relative' padding='9'>
                <Divider color={colors.heading1} />
                <AbsoluteCenter px='10' color={'#fff'} bg={colors.hover} py={'1'} style={{ borderRadius: '10px' }}>
                    Faculties
                </AbsoluteCenter>
            </Box>
            <div className={styles.mentorContainer}>
                {mentors.filter(mentor => mentor.students.length === 0).map(mentor => (
                    <MentorComponent key={mentor.sub_id} {...mentor} />
                ))}

            </div>
        </>
    );


    if (isLoading) {

        return (
            <Loader />
        )
    }

    if (isError) {
        return (
            <h1 style={{ color: colors.font }}>Something Went Wrong</h1>
        )
    }


    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10 }}>
        <h1 style={{ color: colors.font, fontWeight: 'bold', fontSize: 23, marginLeft: 20, marginBottom: '5px' }}>
            <span onClick={() => navigateToStudentsList(user && user.department)} style={{ cursor: 'pointer' }}>
                {user && user.department} <LinkIcon color={colors.primary} />
            </span>
        </h1>
    
        {/* Flex container to align "Add Mentor" and "Add Students" buttons in one line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 10, marginBottom: '20px' }}>
            <div style={{ color: colors.font }}>
                <RegisterMentor />
            </div>
            <div style={{ color: colors.font }}>
                <AddStudents />
            </div>
        </div>
    
        {data.data && <MentorList mentors={data.data.filter(mentor => mentor.sub_id !== 'None')} />}
        <div className={styles.mentorContainer}>
            {data.data.length <= 0 && (
                <div style={{ backgroundColor: colors.hover, height: '150px', width: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                    <h1 style={{ color: colors.font, textAlign: 'center' }}>No Mentors in your Department</h1>
                </div>
            )}
        </div>
    </div>
    
    );
};

export default HomePage;