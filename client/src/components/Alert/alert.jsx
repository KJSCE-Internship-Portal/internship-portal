import React from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
    useDisclosure,
  } from '@chakra-ui/react';
  import { useEffect } from 'react';

  const Alert = ({ onConfirm,text,onClosec }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const [isClicked, setIsClicked] = React.useState(false);

    const handleConfirm = async (event) => {
      setIsClicked(true);
      await onConfirm(event); 
      setIsClicked(false); 
    };
    useEffect(()=>{
      onOpen();
    },[]);
  
    return (
      <>
        
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClosec}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {text}
              </AlertDialogHeader>
  
              <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClosec}>
                  Cancel
                </Button>
                <Button isLoading={isClicked} colorScheme='green' onClick={(event) => handleConfirm(event)} ml={3}>
                  Submit
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
}

export default Alert;