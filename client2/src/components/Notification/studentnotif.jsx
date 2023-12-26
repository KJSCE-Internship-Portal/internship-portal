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

export default function StudentNotification() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="relative inline-block text-right ml-20">
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
            <PopoverBody>
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
    </>
  );
}
