import { UseToastOptions } from '@chakra-ui/react';
import { MAX_LOAD_AI_IMG_RETRY_COUNT } from './constants';

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

export const getFetchAiImageStateError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant fetch AI image state. ${error}`,
});

export const getInitializeAiImageStateError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant initialize AI image state. ${error}`,
});

export const getBuyGeneratorTriesError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant buy more Ai Image Generator tries. ${error}`,
});

export const loadAiImageError = {
    ...errorAlertBase,
    description: `Cant load AI image.`,
};

export const getUseGeneratorTryError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant use AI image generator try. ${error}`,
});

export const loadTimeAiImageError = {
    ...errorAlertBase,
    description: `Model still loading after ${MAX_LOAD_AI_IMG_RETRY_COUNT} retries. Try request again in 5 minutes.`,
};

export const getLoadSavedAiImageError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant load saved AI image. ${error}`,
});

export const notEnoughTodoTokensError = {
    ...errorAlertBase,
    description: `Not enough $TODO on your balance to mint AI Image NFT. For now you can only save your image`,
};

export const addNameToNftError = {
    ...errorAlertBase,
    description: 'NFT name cant be empty!',
};

export const saveAiImageAlert = {
    ...successAlertBase,
    description: 'AI Image successfully saved',
};

export const getSaveAiImageError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant save AI Image. ${error}`,
});

export const getMintAiImageNftError = (error: string) => ({
    ...errorAlertBase,
    description: `Cant mint AI image NFT. ${error}`,
});

export const mintAImageNftAlert = {
    ...successAlertBase,
    description: 'Congratulations! You minted  AI image NFT!',
};
