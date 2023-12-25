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
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import showToast from '../../../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { url } from '../../../../Global/URL';
import axios from 'axios';
import { useTheme } from '../../../../Global/ThemeContext';
import { getUserDetails } from '../../../../Global/authUtils';

const AssignStudent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { theme: colors } = useTheme();
    const [email, setEmail] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [emailError, setEmailError] = useState('');
    const toast = useToast();
    const firstField = React.useRef();
    const [user, setUser] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@somaiya\.edu$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleAddStudent = async () => {
        if (validateEmail()) {
            console.log(email, rollNo);
            onClose();
            const current_user = await getUserDetails();
            setUser(current_user);
            const response = await axios.post(url + '/coordinator/add/student', {
                email,
                rollno: rollNo.toString(),
                department: current_user.department,
            });
            console.log(response.data);
            showToast(toast, 'Success', 'success', 'Student Registered Successfully');
            setEmail('');
            setRollNo('');
        } else {
            showToast(toast, 'Error', 'error', 'Provide a valid Somaiya Email');
        }
    };

    return (
        <>
            <Button leftIcon={<AddIcon />} color={colors.font} bg={colors.hover} onClick={onOpen}>
                Add Student
            </Button>
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
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='0px'>
                        <Button variant='outline' mr={3} onClick={onClose} color={colors.font} bg={colors.hover}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleAddStudent} color={colors.secondary} bg={colors.primary}>
                            Add
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AssignStudent;
