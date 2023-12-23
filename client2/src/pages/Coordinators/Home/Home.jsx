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

    const {isError, isLoading, data} = useQuery({
        queryKey: ['/mentors/all'],
        queryFn: async () => {
        
            const current_user = await getUserDetails();
            setUser(current_user);
            console.log(current_user);
        return (axios
            .get(url + `/mentors/all?department=${slugify(current_user.department)}`)
            .then(response => response.data))
        }
    });


    const MentorComponent = ({ name, profile_picture_url, sub_id }) => (
        <Link to={'/coordinator/mentor/' + `${sub_id}`+ '/students'}>
            <div className={styles.mentorCard}>
            <span className={styles.profilePicContainer}>
                <img src={profile_picture_url} alt={`${name}'s photo`} className={styles.profilePic} />
            </span>
            <h1 style={{ color: colors.font, margin: '5px 8px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>{name}</h1>
            </div>
        </Link>
      );

    if (isLoading){
        return (
            <Loader/>
        )
    }

    if (isError){
        return (
            <h1>Something Went Wrong</h1>
        )
    }
      

    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10 }}>
           
           <h1 style={{color: colors.font, fontWeight: 30, fontSize: 23}}>
                {user && user.department}
           </h1>
            
           <div className={styles.mentorContainer}>
                {data.data.map(mentor => (
                <MentorComponent key={mentor.id} {...mentor} />
                ))}
            </div>
          

           
        </div>
    );
};

export default HomePage;
