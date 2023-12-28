import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useTheme } from '../../Global/ThemeContext';
import { SkeletonLoader } from "../../Global/SkeletonLoader";
import { url } from '../../Global/URL';
import { getUserDetails } from "../../Global/authUtils";

export default function StudentNotification() {
  const { theme: colors } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getNotifs = async (page) => {
    setLoading(true);
    try {
      const user = await getUserDetails();
      const res = await axios.get(`${url}/announcements/all?department=${user.department}&page=${page}&limit=5`);
      setNotifications(res.data.data);
      setTotalPages(Math.min(Math.ceil(res.data.count / 5), 30));
    } catch (error) {
      console.log(error);
      localStorage.removeItem('IMPaccessToken');
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getNotifs(pageNumber);
  };

  const renderNotifications = () => {
    return notifications.map((notification) => (
      <div key={notification._id} className="my-3">
        <p className={`text-sm font-medium text-${colors.font}`}>{notification.sender}</p>
        <p className={`text-xs text-${colors.font}`}>{notification.content}</p>
        <hr className="my-2 border-t-2 border-gray-300" />
      </div>
    ));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button key={i} onClick={() => handlePageChange(i)} className="mr-2"><text color={colors.font}>{i}</text></Button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="relative inline-block text-right ml-20">
        <Popover>
          <PopoverTrigger>
            <Button onClick={() => getNotifs(currentPage)} bg={colors.secondary}>
              <BellIcon color={colors.font} boxSize={5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="left" color={colors.font}>Notifications</PopoverHeader>
            <PopoverBody textAlign="left" color={colors.secondary2}>
              {renderNotifications()}
              <div>
                {renderPageNumbers()}
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
