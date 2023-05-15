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

export const getDeleteTodoErrorAlert = (title: string, error: string) => ({
    ...errorAlertBase,
    description: `Todo "${title}" was not deleted. ${error}`,
});

export const getDeleteTodoAlert = (title: string) => ({
    ...successAlertBase,
    description: `Todo "${title}" successfully deleted`,
});

export const getCreateTodoAlert = (title: string) => ({
    ...successAlertBase,
    description: `Todo "${title}" successfully created`,
});

export const getUpdateTodoAlert = (title: string) => ({
    ...successAlertBase,
    description: `Todo "${title}" successfully updated`,
});

export const getFetchStatsError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant fetch stats. ${error}`,
});

export const getFetchAchievementsError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant fetch achievements. ${error}`,
});

export const mintAchievementAlert = {
    ...successAlertBase,
    description: 'Congratulations! You minted achievement NFT!',
};

export const getMintAchievementError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant mint achievement NFT. ${error}`,
});
