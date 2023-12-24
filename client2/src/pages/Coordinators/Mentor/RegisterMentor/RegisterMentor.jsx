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
    InputGroup,
    InputRightAddon,
    Stack,
    useDisclosure,
    Box,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';

const RegisterMentor = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contactNoError, setContactNoError] = useState('');

    const firstField = React.useRef();

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

    const handleAddMentor = () => {
        if (validateEmail() && validateContactNo()) {
            console.log(name, email, contactNo);
            onClose();
        }
    };

    return (
        <>
            <Button leftIcon={<AddIcon />} colorScheme='teal' onClick={onOpen}>
                Create user
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>Add a Mentor</DrawerHeader>

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
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor='email'>E-Mail</FormLabel>
                                <InputGroup>
                                    <Input
                                        type='text'
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
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='1px'>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleAddMentor}>
                            Add
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default RegisterMentor;
