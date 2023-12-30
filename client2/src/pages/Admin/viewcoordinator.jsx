import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Global/URL';
import { Avatar, Button } from '@chakra-ui/react';
import {useTheme} from '../../Global/ThemeContext';
import CoordinatorDrawer from './coordinatordrawer';

const CoordinatorList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const {theme:colors} = useTheme();

  const openDrawer = (coordinator) => {
    setCoordinatorData(coordinator);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axios.get(url + '/coordinators/all'); 
        setCoordinators(response.data.data);
        console.log(coordinators)
      } catch (error) {
        console.error('Error fetching coordinators:', error);
      }
    };

    fetchCoordinators();
  }, []);

  return (
    <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-left justify-start mx-auto w-full max-h-full py-6 px-4 h-screen text-${colors.font}`}>
    <h1 className={`text-xl font-bold mb-5 text-${colors.font}`}>Coordinators List</h1>
      <ul>
        {coordinators.map((coordinator) => (
        <li key={coordinator.id}>
            
          <div onClick={() => openDrawer(coordinator)} className={`bg-gray-400 border border-${colors.accent} border-solid rounded-md flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
            <div className="flex flex-row justify-start w-full">
              <Avatar size="md" bg='red.700' color="white" name={coordinator.name} src={coordinator.profile_picture_url} className="h-8 w-8 mr-2 mt-0 mb-2"></Avatar>
              <div className="flex flex-1 flex-col items-start justify-start w-full">
                <h1 className={`text-base text-${colors.font} w-full font-semibold`}>{coordinator.name}</h1>
                <p className={`text-${colors.font} text-s w-full`}>{coordinator.email}</p>
              </div>
            </div>
          </div>
          </li>
        ))}
      </ul>
      <CoordinatorDrawer isOpen={isDrawerOpen} onClose={closeDrawer} coordinatorData={coordinatorData} />
    </div>
  );
};

export default CoordinatorList;
