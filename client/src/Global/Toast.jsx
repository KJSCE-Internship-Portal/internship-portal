
function showToast(toast, title, status, description) {
    toast({
      title: `${title}`,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'bottom-right'
    });
  }

  export default showToast;
  