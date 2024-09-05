import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { Avatar, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTheme } from '../../Global/ThemeContext';
import MentorDrawer from './mentordrawer';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mentorData, setMentorData] = useState([]);
  const { theme: colors } = useTheme();

  const openDrawer = (mentor) => {
    setMentorData(mentor);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const renderMentorList = (mentors, department, openDrawer, colors) => {
    const filteredMentors = mentors.filter((mentor) => mentor.department === department);
    const number = filteredMentors.length;
    return (
      <div>
        <p className='mb-4'>
        Number of mentors in {department} : {number}
        </p>
      <ul>
        {filteredMentors.map((mentor) => (
          <li key={mentor.id}>
            <div
              onClick={() => openDrawer(mentor)} style={{cursor: 'pointer'}}
              className={`bg-gray-400 border border-${colors.accent} border-solid rounded-md flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}
            >
              <div className="flex flex-row justify-start w-full">
                <Avatar size="md" bg="red.700" color="white" name={mentor.name} src={mentor.profile_picture_url} className="h-8 w-8 mr-2 mt-0 mb-2"></Avatar>
                <div className="flex flex-1 flex-col items-start justify-start w-full">
                  <h1 className={`text-base text-${colors.font} w-full font-semibold`}>{mentor.name}</h1>
                  <p className={`text-${colors.font} text-s w-full`}>{mentor.email}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
    );
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(url + '/mentors/all');
        setMentors(response.data.data);
        console.log(mentors)
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-left justify-start mx-auto w-full max-h-full py-6 px-4 h-screen text-${colors.font}`}>
      <h1 className={`text-xl font-bold mb-5 text-${colors.font}`} style={{marginLeft: '1.5vw', color: colors.heading1}}>Mentors List</h1>

      <Tabs variant='soft-rounded' isFitted colorScheme='green'>
        <TabList marginX={5} gap={3}>
          <Tab bg={colors.hover} color={colors.font}>COMPS</Tab>
          <Tab bg={colors.hover} color={colors.font}>IT</Tab>
          <Tab bg={colors.hover} color={colors.font}>MECH</Tab>
          <Tab bg={colors.hover} color={colors.font}>EXTC</Tab>
        <Tab bg={colors.hover} color={colors.font}>ETRX</Tab>
        </TabList>
        <TabPanels w={'100%'}>
          <TabPanel>
            {mentors && renderMentorList(mentors, "Computer Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {mentors && renderMentorList(mentors, "Information Technology", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {mentors && renderMentorList(mentors, "Mechanical Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {mentors && renderMentorList(mentors, "Electronics And Telecommunication Engineering", openDrawer, colors)}
          </TabPanel>
          <TabPanel>
            {mentors && renderMentorList(mentors, "Electronics Engineering", openDrawer, colors)}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <MentorDrawer isOpen={isDrawerOpen} onClose={closeDrawer} mentorData={mentorData} />
    </div>
  );
};

export default MentorList;
