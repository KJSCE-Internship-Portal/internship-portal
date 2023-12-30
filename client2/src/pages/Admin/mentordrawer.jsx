import React from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Avatar,
} from "@chakra-ui/react";

function MentorDrawer({ isOpen, onClose, mentorData }) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Mentor Details</DrawerHeader>

        <DrawerBody maxH="80vh" overflowY="auto">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                size="md"
                bg="red.700"
                color="white"
                name={mentorData.name}
                src={mentorData.profile_picture_url}
                className="h-10 w-10 mr-2"
              ></Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{mentorData.name}</h2>
                <p>{mentorData.email}</p>
              </div>
            </div>
            <p>
              <strong>Contact No.:</strong> {mentorData.contact_no}
            </p>
            <p>
              <strong>Department:</strong> {mentorData.department}
            </p>
            <p>
              <strong>Mentored Students:</strong>
            </p>
            <ul>
              {mentorData.students &&
                mentorData.students.length > 0 &&
                mentorData.students.map((student) => (
                  <li key={student.sub_id}>
                    <div className="flex items-center space-x-4">
                      <Avatar
                        size="sm"
                        bg="red.700"
                        color="white"
                        src={student.profile_picture_url}
                        className="h-6 w-6 mr-2"
                      ></Avatar>
                      <div className="flex flex-col">
                        <p>{student.rollno}</p>
                        <p>{student.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MentorDrawer;
