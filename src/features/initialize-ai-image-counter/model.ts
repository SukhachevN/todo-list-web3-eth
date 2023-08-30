import { useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getInitializeAiImageStateError } from '@/shared/alerts';
import { AiImageStateType } from '@/shared/types';

export type InitializeAiImageCounterButtonType = {
    setAiImageState: Dispatch<SetStateAction<AiImageStateType>>;
};

export const useInitializeCounter = ({
    setAiImageState,
}: InitializeAiImageCounterButtonType) => {
    const { contract } = useWorkspace();

    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const initializeCounter = async () => {
        if (!contract) return;

        try {
            setIsLoading(true);
            const tx = await contract.initializeAiImageState();
            await tx.wait();
            setAiImageState({ isInitialized: true, tryCount: 1 });
        } catch (error) {
            if (error instanceof Error) {
                const alert = getInitializeAiImageStateError(error.message);
                toast(alert);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { initializeCounter, isLoading };
};
