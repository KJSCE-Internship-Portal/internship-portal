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

function CoordinatorDrawer({ isOpen, onClose, coordinatorData }) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Coordinator Details</DrawerHeader>

        <DrawerBody maxH="80vh" overflowY="auto">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                size="md"
                bg="red.700"
                color="white"
                name={coordinatorData.name}
                src={coordinatorData.profile_picture_url}
                className="h-10 w-10 mr-2"
              ></Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{coordinatorData.name}</h2>
                <p>{coordinatorData.email}</p>
              </div>
            </div>
            <p>
              <strong>Contact No.:</strong> {coordinatorData.contact_no}
            </p>
            <p>
              <strong>Department:</strong> {coordinatorData.department}
            </p>
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

export default CoordinatorDrawer;
