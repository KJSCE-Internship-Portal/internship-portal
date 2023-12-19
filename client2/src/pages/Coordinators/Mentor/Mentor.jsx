import React, { useEffect, useRef, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { useTheme } from '../../../Global/ThemeContext';
import styles from './Mentor.module.css';
import { useParams } from 'react-router-dom';


const MentorPage = () => {
    const { theme: colors } = useTheme();
    const {id} = useParams();
    const [mentor, setMentor] = useState(false);

    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10 }}>
        
        <div>
            <h1 style={{color: colors.font, fontSize: '22px', fontWeight: 'bold', paddingLeft: '15px'}}>
                Dr. Stephen Strange
            </h1>
        </div>

        <div className={styles.studentsListContainer}>
            <div className={styles.studentList}>
                <div>
                    <span className={styles.studentAvatar}></span>
                </div>
                <div className={styles.studentName}>Pranav Patil</div>
            </div>
            <div className={styles.studentList}></div>
            <div className={styles.studentList}></div>
        </div>

        <div className={styles.addStudentButtonContainer}>
        <div className={styles.addStudentButton}>
            Add More Students
        </div>
        </div>

        
        </div>
    );
};

export default MentorPage;
