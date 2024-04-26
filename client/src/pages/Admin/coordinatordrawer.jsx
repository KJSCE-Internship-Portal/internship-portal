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
import axios from 'axios';
import {url} from "../../Global/URL";
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import Alert from '../../components/Alert/alert';



function CoordinatorDrawer({ isOpen, onClose, coordinatorData }) {

  const deleteCoordiator = async (id) => {
    try {
      const response = await axios.post(url + '/admin/delete/coordinator', {id: id});
      if (response.data.success) {
          showToast(toast, "Success", 'success', "Co-ordinator Deleted !");
      } else {
          showToast(toast, "Warning", 'info', "No Co-ordinator exist !");
      }
  } catch (error) {
      showToast(toast, "Error", 'error', "Something Went Wrong !");
  }
  }

  const toast = useToast();
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
        <Button variant="outline" colorScheme="red" mr={3} onClick={() => (deleteCoordiator(coordinatorData._id))}>
            Delete
          </Button>
          <Button w={60} mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CoordinatorDrawer;
