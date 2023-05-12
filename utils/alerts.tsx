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

export const getFetchTodosError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant fetch todos. ${error}`,
});

export const getCreateTodoErrorAlert = (title: string, error: string) => ({
    ...errorAlertBase,
    description: `Todo "${title}" was not created. ${error}`,
});

export const getUpdateTodoErrorAlert = (title: string, error: string) => ({
    ...errorAlertBase,
    description: `Todo "${title}" was not updated. ${error}`,
});
