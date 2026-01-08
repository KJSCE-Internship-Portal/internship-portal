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
  Select,
} from "@chakra-ui/react";
import { AddIcon, BellIcon } from "@chakra-ui/icons";
import { url } from '../../Global/URL';

export default function Modal() {
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [recipientType, setRecipientType] = useState("all_users");

  const handlePost = async () => {
    try {
      const response = await fetch(url + "/announcement/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          department: "All", // You can modify this as needed
          sender: "Admin", // You can get this from auth context
          received_by: {
            department: "All",
            only_for_faculties: false,
          },
          recipientType: recipientType,
          content: task,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Announcement posted successfully!");
        setTask("");
        setRecipientType("all_users");
        setShowModal(false);
      } else {
        alert("Failed to post announcement");
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Error posting announcement");
    }
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
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <AddIcon boxSize={4} />
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
                  <h3 className="text-3xl font-semibold">
                    Announcement Section:
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
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Send to:
                        </label>
                        <Select
                          value={recipientType}
                          onChange={(e) => setRecipientType(e.target.value)}
                          bg="white"
                          borderColor="gray-300"
                        >
                          <option value="all_users">All Users</option>
                          <option value="all_coordinators">All Coordinators</option>
                          <option value="all_mentors">All Mentors</option>
                          <option value="all_students">All Students</option>
                        </Select>
                      </div>
                      <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-200 dark:border-gray-700">
                        <Textarea
                          id="comment"
                          rows="6"
                          value={task}
                          onChange={(e) => setTask(e.target.value)}
                          placeholder="Write a message..."
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
                    mr={2}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePost}
                    bgColor="blue.500"
                    _hover={{ bgColor: "blue.800" }}
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
