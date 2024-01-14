import React, { useEffect, useState } from 'react';
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
    InputGroup,
    InputRightAddon,
    Stack,
    useDisclosure,
    Box,
    Select
} from '@chakra-ui/react';
import { useTheme } from '../../Global/ThemeContext';
import { AddIcon } from '@chakra-ui/icons';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { url } from '../../Global/URL';
import axios from 'axios';
import { getUserDetails } from '../../Global/authUtils';

const AddMentor = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { theme: colors } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contactNoError, setContactNoError] = useState('');
    const toast = useToast();
    const [department, setDepartment] = useState('');
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

    const validateContactNo = () => {
        const contactNoRegex = /^[0-9]{10}$/;
        if (!contactNoRegex.test(contactNo)) {
            setContactNoError('Invalid contact number');
            return false;
        }
        setContactNoError('');
        return true;
    };

    const handleAddMentor = async () => {
        // if (name == ''){
        //     showToast(toast, "Error", 'error', "Name Cannot Be Empty");
        //     return
        // }

        if (validateEmail() && validateContactNo()) {
            console.log(name, email, contactNo);
            onClose();
            const current_user = await getUserDetails();
            setUser(current_user)
            try {

                const response = await axios.post(url + '/coordinator/add/mentor', { name, email, contact_no: contactNo.toString(), department });
                console.log(response.data)
                if (response.data.success) {
                    showToast(toast, "Success", 'success', "Mentor Registered Successfully");
                } else {
                    showToast(toast, "Warning", 'info', "Mentor Already Exist");
                }
                setEmail('');
                setName('');
                setContactNo('');
            } catch (error) {
                showToast(toast, "Error", 'error', "Something Wen't Wrong !");
            }


        }
        else {
            if (!validateEmail()) {
                showToast(toast, "Error", 'error', "Provide a valid Somaiya Email");
            } else if (!validateContactNo()) {
                showToast(toast, "Error", 'error', "Provide a valid Contact no.");
            }
        }

    };


    return (
        <>
            <Button ml={3} 
            // leftIcon={<AddIcon />} 
            color={colors.font} bg={colors.hover} onClick={onOpen}>
                Add Mentor
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}

            >
                <DrawerOverlay />
                <DrawerContent color={colors.font} bg={colors.secondary}>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='0px'>Add a Mentor</DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px'>
                            <Box>
                                <FormLabel htmlFor='username'>Name</FormLabel>
                                <Input
                                    ref={firstField}
                                    id='username'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    isRequired
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor='email'>E-Mail</FormLabel>
                                <InputGroup>
                                    <Input
                                        type='email'
                                        id='email'
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {/* <InputRightAddon>@somaiya.edu</InputRightAddon> */}
                                </InputGroup>
                            </Box>

                            <Box>
                                <FormLabel htmlFor='contactno'>Contact No.</FormLabel>
                                <Input
                                    ref={firstField}
                                    type='tel'
                                    id='contactno'
                                    placeholder='Contact no.'
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='department'>Department</FormLabel>
                                <Select
                                    id='department'
                                    placeholder='Select Department'
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Computer Engineering">COMPS</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Information Technology">IT</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Mechanical Engineering">MECH</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Electronics & Telecommunication Engineering">EXTC</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Electronics Engineering">ETRX</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Electronics & Computer Engineering" hidden>EXCP</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Robotics & Artificial Intelligence" hidden>RAI</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Artificial Intelligence & Data Science" hidden>AIDS</option>
                                        <option style={{backgroundColor: colors.secondary, color: colors.font}} value="Computer & Communication Engineering" hidden>CCE</option>
                                </Select>
                            </Box>

                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='0px'>
                        <Button variant='outline' mr={3} onClick={onClose} color={colors.font} bg={colors.hover}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleAddMentor} color={colors.secondary} bg={colors.primary}>
                            Add
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AddMentor;
