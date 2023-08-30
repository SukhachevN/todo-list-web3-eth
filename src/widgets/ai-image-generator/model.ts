import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getFetchAiImageStateError } from '@/shared/alerts';
import { AiImageStateType } from '@/shared/types';

export const useAiImageGenerator = () => {
    const { contract, account } = useWorkspace();

    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [aiImageState, setAiImageState] = useState<AiImageStateType>({
        isInitialized: false,
        tryCount: 0,
    });
    const [isSectionUnlocked, setIsSectionUnlocked] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!contract || !account) return;

            setIsLoading(true);

            try {
                const stats = await contract.getStats();
                const balance = await contract.balanceOf(account);
                const aiImageState = await contract.getAiImageState();

                setIsSectionUnlocked(stats.created.toNumber() > 0);
                setBalance(balance.toNumber());
                setAiImageState({
                    ...aiImageState,
                    tryCount: aiImageState.tryCount.toNumber(),
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast(getFetchAiImageStateError(error.message));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [contract]);

    return {
        isLoading,
        balance,
        aiImageState,
        isSectionUnlocked,
        setAiImageState,
        setBalance,
    };
};
