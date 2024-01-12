import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
  Textarea,
  useToast,
  SkeletonText,
  Box
} from "@chakra-ui/react";
import { AddIcon, BellIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useTheme } from '../../Global/ThemeContext';
import { SkeletonLoader } from "../../Global/SkeletonLoader";
import { url } from '../../Global/URL';
import { getUserDetails } from "../../Global/authUtils";
import showToast from "../../Global/Toast";

export default function StudentNotification() {
  const { theme: colors } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [canPost, setCanPost] = useState(false);
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(false);

  const getNotifs = async (page) => {
    setLoading(true);
    try {
      if (!currentUser) {
        var user = await getUserDetails();
        setCurrentUser(user);
      }
      else {
        var user = currentUser;
      }
      console.log(user);
      if (user.role == 'ADMIN') {
        setCanPost(true);
        const res = await axios.get(`${url}/announcements/all?page=${page}&limit=5&sort=-postedAt`);
        console.log(res);
        setNotifications(res.data.data);
        setTotalPages(Math.min(Math.ceil(res.data.count / 5), 30));
      }
      else if (user.role == 'COORDINATOR') {
        setCanPost(true)
        const res = await axios.get(`${url}/announcements/all?department=${user.department},All&page=${page}&limit=5&sort=-postedAt`);
        setNotifications(res.data.data);
        setTotalPages(Math.min(Math.ceil(res.data.count / 5), 30));
      }
      else {
        const res = await axios.get(`${url}/announcements/all?department=${user.department},All&page=${page}&limit=5&sort=-postedAt`);
        setNotifications(res.data.data);
        setTotalPages(Math.min(Math.ceil(res.data.count / 5), 30));
      }

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
        <div className="flex justify-between">
        <div>
        <p style={{ color: colors.heading1, fontSize: '18px' }} className={`text-sm font-medium`}>{notification.sender}</p>
        <p style={{ color: colors.font, fontSize: '16px' }} className={`text-xs`}>{notification.content}</p>
        </div>
        <div>
          <p style={{ color: colors.font, fontSize: '14px' }} className={`text-xs`}>
            {new Date(notification.postedAt).toLocaleString()}
          </p>
        </div>
        </div>
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

  const postAnnouncement = async () => {

    try {
      if (task.trim() === "") {
        showToast(toast, "Error", 'error', "Announcement Cannot Be Left Empty !");
        return
      }
      if (!currentUser) {
        var user = await getUserDetails();
        setCurrentUser(user);
      }
      else {
        var user = currentUser;
      }
      const response = await axios.post(url + '/announcement/add', {
        department: user.role == 'COORDINATOR' ? user.department : "All",
        sender: user.name,
        content: task,
        received_by: {
          department: user.role == 'COORDINATOR' ? user.department : "All",
          only_for_faculties: false
        }
      });
      if (response.data.success) {
        showToast(toast, "Success", 'success', "Announcement Posted Successfully");
      } else {
        showToast(toast, "Warning", 'info', "Announcement Cannot Be Posted !");
      }
    } catch (error) {
      showToast(toast, "Error", 'error', "Something Wen't Wrong !");
    }
  }

  return (
    <>
      <div className="relative inline-block text-right ml-20">
        <Popover>
          <PopoverTrigger>
            <Button onClick={() => getNotifs(currentPage)} bg={colors.secondary}>
              <BellIcon color={colors.font} boxSize={5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent bg={colors.secondary} minW={'40vw'}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="left" bg={colors.secondary} color={colors.font}>
              Notifications
              {canPost && <Button marginLeft={3} bg={colors.secondary}
                onClick={() => {
                  return setShowModal(true);
                }}
              ><AddIcon color={colors.heading1} boxSize={3} /></Button>}
            </PopoverHeader>
            <PopoverBody textAlign="left" bg={colors.secondary}>
              {!loading ?
                renderNotifications() :
                <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' mb={7} />
              }
              <div>
                {renderPageNumbers()}
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Post Your Announcement
                    </h3>
                    <div className="ml-10">
                      <Button
                        onClick={() => setShowModal(false)}
                        variant="unstyled"
                      >
                        <span className="text-red-700">x</span>
                      </Button>
                    </div>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      <form>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:border-gray-700">
                          <Textarea
                            id="comment"
                            rows="6"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Write a comment..."
                            required
                            textAlign="left"
                          />
                        </div>
                      </form>
                    </p>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <Button
                      onClick={() => {
                        postAnnouncement();
                        setShowModal(false);
                        return
                      }}
                      bgColor="red.500"
                      _hover={{ bgColor: "red.800" }}
                      color="white"
                      size="sm"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
}
