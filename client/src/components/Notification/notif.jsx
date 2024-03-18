import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Textarea,
} from "@chakra-ui/react";
import { AddIcon, BellIcon } from "@chakra-ui/icons";

const isAdmin = true;

export default function NotificationComponent() {
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="relative inline-block text-left ml-20">
        <Popover>
          <PopoverTrigger>
            <Button>
              <BellIcon boxSize={5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="left">Notifications</PopoverHeader>
            <PopoverBody textAlign="left">
              {isAdmin && (
                <Button
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <AddIcon boxSize={4} /> Add Announcement
                </Button>
              )}
              <Button
                onClick={() => {
                  toggleDropdown();
                }}
              >
                See All Notifications
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Announcement Section:</h3>
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
                      <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-200 dark:border-gray-700">
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
                    onClick={() => setShowModal(false)}
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
    </>
  );
}
