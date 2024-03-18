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
    Avatar,
    Tooltip,
    Divider,
    AbsoluteCenter
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import showToast from '../../../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { url } from '../../../../Global/URL';
import axios from 'axios';
import { useTheme } from '../../../../Global/ThemeContext';
import { getUserDetails } from '../../../../Global/authUtils';
import Alert from '../../../../components/Alert/alert';
import { useQuery } from '@chakra-ui/react';

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
    const [rollNo, setRollNo] = useState('');
    const [emailError, setEmailError] = useState('');
    const toast = useToast();
    const firstField = React.useRef();
    const [user, setUser] = useState(false);
    const [listOfStudents, setListofStudents] = useState(false);
    const [showDataModal, setshowDataModal] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@somaiya\.edu$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return false;
        }
        setEmailError('');
        return true;
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
            }
            else {
                stu = listOfStudents;
            }
            console.log(stu)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddStudent = async () => {
        if (validateEmail() && rollNo.length > 0) {

            try {
                if (!user) {
                    var current_user = await getUserDetails();
                    setUser(current_user);
                } else {
                    var current_user = user;
                }
                const response = await axios.post(url + '/coordinator/mentor/assign-student', {
                    mentor_email,
                    rollno: rollNo.toString(),
                    student_email: email,
                    department: current_user.department,
                });
                console.log(response.data);
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
        } else {
            showToast(toast, 'Error', 'error', 'Provide a valid Somaiya Email');
        }
    };

    return (
        <>
            <Tooltip label='Assign Student to this Mentor' placement='left'>
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
                                <FormLabel htmlFor='email'>E-Mail</FormLabel>
                                <Input
                                    ref={firstField}
                                    type='email'
                                    id='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
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
                        </Stack>
                        <Box position='relative' padding='9'>
                            <Divider />
                            <AbsoluteCenter px='4' color={'#fff'} bg={colors.primary} style={{ borderRadius: '10px' }}>
                                Students
                            </AbsoluteCenter>
                        </Box>
                        <Stack maxH={'350px'} style={{ padding: '3px 5px 10px 7px' }} overflowY={'auto'}>

                            {
                                listOfStudents &&
                                listOfStudents.map((stu, index) => (
                                    <Tooltip key={index} label={stu.name + ", " + stu.email}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                padding: '5px 7px',
                                                borderRadius: '15px',
                                                flexDirection: 'row',
                                                backgroundColor: rollNo === stu.rollno ? colors.hover : null, // Check if the student is selected
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => {
                                                setEmail(stu.email);
                                                setRollNo(stu.rollno);
                                            }}
                                        >
                                            <Avatar src={stu.profile_picture_url} h={10} w={10} name={stu.name} />
                                            <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                                <p style={{ paddingLeft: '5px' }}>{stu.rollno}</p>
                                            </div>
                                        </div>
                                    </Tooltip>
                                ))
                            }


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

                        />)
                        }
                        <Button colorScheme='blue' onClick={()=>setshowDataModal(true)} color={colors.secondary} bg={colors.primary}>
                            Add
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AssignStudent;
