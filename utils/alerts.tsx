import { UseToastOptions } from '@chakra-ui/react';

const errorAlertBase: UseToastOptions = {
    isClosable: true,
    status: 'error',
    title: 'Error',
    duration: 5000,
};

const successAlertBase: UseToastOptions = {
    isClosable: true,
    status: 'success',
    title: 'Success',
    duration: 5000,
};

export const noMetaMaskError = {
    ...errorAlertBase,
    description: 'Make sure you have MetaMask!',
};

export const getRequestAccountError = (error: string) => ({
    ...errorAlertBase,
    description: error,
});
