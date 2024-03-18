import React, { useEffect, useRef, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { useTheme } from '../../../Global/ThemeContext';
import styles from './Mentor.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { url } from '../../../Global/URL';
import AssignStudent from './AssignStudent/AssignStudent';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import showToast from '../../../Global/Toast';
import Alert from '../../../components/Alert/alert';


const getRandomLightColor = () => {

    const r = Math.floor(Math.random() * 128) + 128; // Red component
    const g = Math.floor(Math.random() * 128) + 128; // Green component
    const b = Math.floor(Math.random() * 128) + 128; // Blue component

    // Convert RGB values to hexadecimal and concatenate
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return color;
};


const MentorPage = () => {
    const [DeleteModal, setDeleteModal] = useState(false);
    const [unassignModalState, setUnassignModalState] = useState({});
    
    const { theme: colors } = useTheme();
    const { id } = useParams();
    const toast = useToast();

    const { isError, isLoading, data } = useQuery({
        queryKey: [`/mentors/all?sub_id=${id}`],
        retryDelay: 5000,
        queryFn: () =>
            axios
                .get(url + `/mentors/all?sub_id=${id}`)
                .then(response => response.data),
    });

    const openUnassignModal = (student) => {
        setUnassignModalState(prevState => ({
            ...prevState,
            [student.rollno]: true // Set modal state for the specific student
        }));
    };

    const unassignStudent = async (roll) => {
        if (data && data.data[0].email){
            try {
                const res = await axios.post(url + '/coordinator/mentor/remove-assigned-student', { rollno: roll, mentor_email: data.data[0].email  });
                if (res.data.success) {
                    showToast(toast, 'Success', 'success', 'Student Unassigned');
                    setUnassignModalState(false);
                } else {
                    showToast(toast, 'Error', 'error', res.data.msg);
                }
            } catch (error) {
                showToast(toast, 'Error', 'error', 'Something Went Wrong');
            }
        }
    }

    const removeMentor = async () => {
        if (data && data.data[0].email){
            try {
                const res = await axios.post(url + '/remove/mentor', { email: data.data[0].email });
                if (res.data.success) {
                    showToast(toast, 'Success', 'success', 'Mentor Deleted');
                    window.location.href = "/coordinator/home";
                } else {
                    showToast(toast, 'Error', 'error', res.data.msg);
                }
            } catch (error) {
                showToast(toast, 'Error', 'error', 'Something Went Wrong');
            }
        }
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    if (isError) {
        return (
            <h1>Something Went Wrong</h1>
        )
    }

    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10 }}>

            <div>
                <span style={{ float: 'right', display: 'block' }}>
                {DeleteModal && (
                                    <Alert
                                    onConfirm={removeMentor}
                                    text={'Remove Mentor'}
                                    onClosec={() => setDeleteModal(false)}
                                    />
                        )}
                    <Tooltip label='Delete Mentor Permanently' placement='left'>
            
                        <Button
                            // isLoading
                            loadingText='Deleting'
                            variant='outline'
                            colorScheme='red'
                            onClick={()=>setDeleteModal(true)}
                        >
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                </span>
                <div>
                    <span style={{ height: '80px', width: '80px', margin: '5px 0 20px 15px' }} className={styles.studentAvatar}>
                        <img src={data.data[0].profile_picture_url} alt="No Profile Photo" />
                    </span>
                </div>
                <h1 style={{ color: colors.font, fontSize: '23px', fontWeight: 'bold', paddingLeft: '15px' }}>
                    {(data.data[0].name)}
                </h1>
                <h3 style={{ color: colors.primary, fontSize: '20px', fontWeight: 'bold', paddingLeft: '15px' }}>
                    {(data.data[0].email)}
                </h3>
            </div>

            <div className={styles.studentsListContainer}>
                {
                    data.data[0].students.length > 0 ? (
                        data.data[0].students.map((student, index) => (
                            <div className={styles.studentList} key={index} >
                                <div>
                                    <span className={styles.studentAvatar}>
                                        <Avatar name={student.email} src='' bg={getRandomLightColor()} />
                                    </span>
                                </div>
                                <div className={styles.studentName}>{student.rollno}</div>
                                {/* <div className={styles.studentName} style={{marginLeft:"50px", border: "1px solid black", padding: "5px"}} onClick={() => {unassignStudent(student.rollno)}}>UNASSIGN</div> */}            
                                <div className={styles.studentName} style={{ marginLeft: "50px", padding: "5px" }}>
                                    <Button
                                        loadingText='Unassigning'
                                        variant='outline'
                                        colorScheme='red'
                                        onClick={() => openUnassignModal(student)}
                                    >
                                        UNASSIGN
                                    </Button>
                                </div>

                                {/* Alert component for unassign confirmation */}
                                {unassignModalState[student.rollno] && (
                                    <Alert
                                        onConfirm={() => unassignStudent(student.rollno)}
                                        text={'Unassign Student'}
                                        onClosec={() => setUnassignModalState(prevState => ({
                                            ...prevState,
                                            [student.rollno]: false
                                        }))}
                                    />
                                )}
                                </div>
                            ))
                    ) : (
                            <div style={{ color: colors.font, fontStyle: 'italic', fontSize: '20px', height: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Students Allocated</div>
                        )
                }

            </div>

            <div className={styles.addStudentButtonContainer}>
                <AssignStudent mentor_sub_id={id} mentor_email={data.data[0].email} />
            </div>
        </div>
    );
};

export default MentorPage;
