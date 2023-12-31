import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Editable,
  EditableInput,
  Flex,
  Heading,
  Avatar,
  useEditableControls,
  IconButton,
  ButtonGroup,
  EditablePreview,
  Center,
  ChakraProvider,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { extendTheme } from '@chakra-ui/react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { useEffect } from 'react';

// Extend the theme for Chakra UI (optional)
const theme = extendTheme({
    fonts: {
      heading: 'Georgia, serif',
      body: 'Arial, sans-serif',
    },
    components: {
      Heading: {
        baseStyle: {
          fontWeight: 'bold',
        },
      },
      Text: {
        baseStyle: {
          color: 'brand.600',
        },
      },
    },

});




function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();
  

  return (
    <Box ml={2}>
      {isEditing ? (
        <ButtonGroup justifyContent="center" size="sm">
          <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
          <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
      ) : (
        <Flex justifyContent="flex-end">
          <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
        </Flex>
      )}
    </Box>
  );
}

const Activity = ({ label, value, isEditable }) => {
    const [editValue, setEditValue] = useState(value);
  
    // Update local state when `value` prop changes
    useEffect(() => {
      setEditValue(value);
    }, [value]);
  
    return (
      <Flex align="center" justify="space-between" p={2}>
        <Text fontWeight="bold">{label}:</Text>
        {isEditable ? (
          <Editable
            defaultValue={editValue}
            isPreviewFocusable={false}
            onChange={(newEditValue) => setEditValue(newEditValue)}
            onSubmit={(nextValue) => setEditValue(nextValue)}
            submitOnBlur={false}
          >
            <Flex align="center" w="full">
              <EditablePreview />
              <EditableInput />
              <EditableControls />
            </Flex>
          </Editable>
        ) : (
          <Text>{value}</Text>
        )}
      </Flex>
    );
  };
  
  

const Profile = () => {
    const accessToken = localStorage.getItem('IMPaccessToken');

  const getUser = async () => {
    try {
      const data = await axios.post(url + "/anyuser", { accessToken });
      const user = data.data.msg._doc;
      return user;
    } catch (error) {
      console.log(error);
      localStorage.removeItem('IMPaccessToken');
    }
  }

  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [company, setCompany] = useState('');
    const [mentor, setMentor] = useState('');
    const [department, setDepartment] = useState('');
    const [division, setDivision] = useState('');
    const [rollno, setRollNo] = useState('');
    const [batch, setBatch] = useState('');
    // const [facultyMentor, setFacultyMentor] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [stipend, setStipend] = useState('');
    const [profile_url, setProfilePicture] = useState('');

  const userDetails = [
    {
      label: "Name",
      value: name,
      isEditable: false,
    },
    {
      label: "Email",
      value:email,
      isEditable: false,
    },
    {
      label: "Department",
      value: department,
      isEditable: false,
    },
    {
      label: "Contact No",
      value: phone,
      isEditable: false,
    },
    {
      label: "Mentor",
      value: mentor,
      isEditable: false,
    },
    {
      label: "Roll NUmber",
      value: rollno,
      isEditable: false,
    },
    {
      label: "Job description",
      value: jobDescription,
      isEditable: false,
    },
  ];

  useEffect(() => {
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userInfo = await getUser();
      console.log(userInfo);
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.contact_no);
      setProfilePicture(userInfo.profilr_picture_url);
      setMentor(userInfo.mentor);
      setDepartment(userInfo.department);
      setJobDescription(userInfo.internships[0].job_description);
      setMentor(userInfo.mentor.name);
      setRollNo(userInfo.rollno);

    }
    catch(error){
      console.log(error);

    }
}

  return (
    <ChakraProvider theme={theme}>
      <Center className="min-h-screen bg-gray-100">
        
        <Box
          className="max-w-xl mx-auto px-6 py-2 border-2 border-gray-300 rounded-lg shadow-lg my-5 bg-white"
        >
          <VStack spacing={3} align="stretch"> {/* reduced spacing */}
            <Heading as="h1" size="xl" textAlign="center" mb={4} className="text-xl font-semibold text-gray-700">
              Profile
            </Heading>
            <Avatar size="md" bg='red.700' color="white" name={name} src={profile_url} className="h-10 w-10 mr-2"></Avatar>
            {userDetails.map((detail, index) => (
              <Box key={index} p={3} className="border-t border-gray-200"> {/* reduced padding */}
    
                <Activity
                  label={detail.label}
                  value={detail.value}
                  isEditable={detail.isEditable}
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </Center>
    </ChakraProvider>
  );
};


export default Profile;
