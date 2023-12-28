import React, { useEffect, useRef, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { useTheme } from '../../../Global/ThemeContext';
import styles from './Home.module.css';
import axios from 'axios';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { url } from '../../../Global/URL';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../../../Global/authUtils';
import RegisterMentor from '../Mentor/RegisterMentor/RegisterMentor';
import {LinkIcon} from '@chakra-ui/icons';

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
            const temp= await axios
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
        <Link to={'/coordinator/mentor/' + `${sub_id}` + '/students'}>
            <div className={styles.mentorCard}>
                <span className={styles.profilePicContainer}>
                    <img src={profile_picture_url} alt={`${name}'s photo`} className={styles.profilePic} />
                </span>
                <h1 style={{ color: colors.font, margin: '5px 8px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>{name}</h1>
                <h1 style={{ color: colors.primary, margin: '5px 8px', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>Mentoring {students.length} students</h1>

            </div>
        </Link>
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
                    {user && user.department} <LinkIcon color={colors.primary}/>
                </span>
            </h1>

            <div style={{ color: colors.font, marginLeft: 20 }}><RegisterMentor /></div>

            <div className={styles.mentorContainer}>
                {data.data && data.data.map((mentor) => {
                    if (mentor.sub_id !== 'None') {
                        return <MentorComponent key={mentor.id} {...mentor} />;
                    }
                    return null;
                })}

                {data.data.length <= 0 && <div style={{ backgroundColor: colors.hover, height: '150px', width: '95%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                    <h1 style={{ color: colors.font, textAlign: 'center' }}>No Mentors in your Department</h1>
                </div>}

            </div>



        </div>
    );
};

export default HomePage;
