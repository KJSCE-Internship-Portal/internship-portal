import React, { useState } from 'react';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormLabel,
    Input,
    Stack,
    useDisclosure,
    Box,
    Tooltip,
    useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import showToast from '../../../../Global/Toast';
import { url } from '../../../../Global/URL';
import axios from 'axios';
import { useTheme } from '../../../../Global/ThemeContext';
import { getUserDetails } from '../../../../Global/authUtils';
import Alert from '../../../../components/Alert/alert';
import AddStudentsexcel from './MentorCSV/AddStudentsexcel';

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

const AssignStudent = ({ mentor_sub_id, mentor_email }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { theme: colors } = useTheme();
    const [email, setEmail] = useState('');
    const [mentorEmail, setMentorEmail] = useState(mentor_email);
    const [rollNo, setRollNo] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mentorEmailError, setMentorEmailError] = useState('');
    const toast = useToast();
    const firstField = React.useRef();
    const [user, setUser] = useState(false);
    const [listOfStudents, setListofStudents] = useState(false);
    const [showDataModal, setshowDataModal] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@somaiya\.edu$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }
        return '';
    };

    const fetchStudents = async () => {
        try {
            var stu = false;
            if (!user) {
                var current_user = await getUserDetails();
                setUser(current_user);
            } else {
                var current_user = user;
            }
            if (!listOfStudents) {
                stu = (await axios.get(url + "/students/all?department=" + slugify(current_user.department) + "&select=rollno,email,name,profile_picture_url&hasMentor=false")).data.data;
                setListofStudents(stu);
            } else {
                stu = listOfStudents;
            }
        } catch (error) {
            console.log(error);
        }
      };

    const handleAddStudent = async () => {
        const studentEmailError = validateEmail(email);
        const mentorEmailError = validateEmail(mentorEmail);

        if (studentEmailError || mentorEmailError || rollNo.length === 0) {
            setEmailError(studentEmailError);
            setMentorEmailError(mentorEmailError);
            showToast(toast, 'Error', 'error', 'Provide valid email(s) and roll number');
            return;
        }

        try {
            if (!user) {
                var current_user = await getUserDetails();
                setUser(current_user);
            } else {
                var current_user = user;
            }
            const response = await axios.post(url + '/coordinator/mentor/assign-student', {
                mentor_email: mentorEmail,
                rollno: rollNo.toString(),
                student_email: email,
                department: current_user.department,
            });
            if (response.data.success) {
                showToast(toast, 'Success', 'success', 'Student Assigned');
                setEmail('');
                setRollNo('');
            } else {
                showToast(toast, 'Error', 'error', response.data.msg);
            }
        } catch (error) {
            showToast(toast, 'Error', 'error', 'Something Went Wrong');
        }
        onClose();
    };

    return (
        <>
            <Tooltip label='' placement='left'>
                <Button leftIcon={<AddIcon />} color={colors.font} bg={colors.hover} onClick={() => {
                    fetchStudents();
                    return onOpen();
                }}>
                    Add Student
                </Button>
            </Tooltip>
            <Drawer isOpen={isOpen} placement='right' initialFocusRef={firstField} onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent color={colors.font} bg={colors.secondary}>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='0px'>Add a Student</DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px'>
                            <Box>
                                <FormLabel htmlFor='email'>Student E-Mail</FormLabel>
                                <Input
                                    ref={firstField}
                                    type='email'
                                    id='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailError && <Box color="red" mt="2">{emailError}</Box>}
                            </Box>

                            <Box>
                                <FormLabel htmlFor='mentorEmail'>Mentor E-Mail</FormLabel>
                                <Input
                                    type='email'
                                    id='mentorEmail'
                                    placeholder='Mentor Email'
                                    value={mentorEmail}
                                    onChange={(e) => setMentorEmail(e.target.value)}
                                />
                                {mentorEmailError && <Box color="red" mt="2">{mentorEmailError}</Box>}
                            </Box>

                            <Box>
                                <FormLabel htmlFor='rollNo'>Roll No.</FormLabel>
                                <Input
                                    ref={firstField}
                                    id='rollNo'
                                    placeholder='Roll No.'
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <AddStudentsexcel/>
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='0px'>
                        <Button variant='outline' mr={3} onClick={onClose} color={colors.font} bg={colors.hover}>
                            Cancel
                        </Button>
                        {showDataModal && (
                            <Alert
                                onConfirm={handleAddStudent}
                                text={'Add student'}
                                onClosec={() => setshowDataModal(false)}
                            />
                        )}
                        <Button colorScheme='blue' onClick={() => setshowDataModal(true)} color={colors.secondary} bg={colors.primary}>
                            Add
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AssignStudent;
