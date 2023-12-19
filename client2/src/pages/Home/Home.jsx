import React, { useEffect, useRef, useState } from 'react';
import Loader from '../../components/loader/Loader';
import { useTheme } from '../../Global/ThemeContext';
import styles from './Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';



const HomePage = () => {
    const { theme: colors } = useTheme();

    const mentors = [
        {
            name: "Prof. ABC",
            id: 'XYZ',
            photo: 'https://myaccount.somaiya.edu/img/somaiya-vidyavihar-brand.svg'
        },

        {
            name: "Prof. ABCDEFGH",
            id: 'XYZ',
            photo: 'https://myaccount.somaiya.edu/img/somaiya-vidyavihar-brand.svg'
        },
        
    ]

    const MentorComponent = ({ name, photo }) => (
        <div className={styles.mentorCard}>
          <span className={styles.profilePicContainer}>
            <img src={photo} alt={`${name}'s photo`} className={styles.profilePic} />
          </span>
          <h1 style={{ color: colors.font, margin: '5px 8px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>{name}</h1>
        </div>
      );
      

    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10 }}>
           
           <h1 style={{color: colors.font, fontWeight: 30, fontSize: 22}}>
                Mentors
           </h1>
            
           <div className={styles.mentorContainer}>
                {mentors.map(mentor => (
                <MentorComponent key={mentor.id} {...mentor} />
                ))}
            </div>
          

           
        </div>
    );
};

export default HomePage;
