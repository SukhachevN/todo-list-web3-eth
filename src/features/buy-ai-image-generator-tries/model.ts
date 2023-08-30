import { Dispatch, SetStateAction, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getBuyGeneratorTriesError } from '@/shared/alerts';
import { AI_IMAGE_TRY_PRICE } from '@/shared/constants';
import { AiImageStateType } from '@/shared/types';

export type UseBuyAiImageGeneratorTriesType = {
    setAiImageState: Dispatch<SetStateAction<AiImageStateType>>;
    setBalance: Dispatch<SetStateAction<number>>;
};

export const useBuyAiImageGeneratorTries = ({
    setAiImageState,
    setBalance,
}: UseBuyAiImageGeneratorTriesType) => {
    const { contract } = useWorkspace();

    const [amount, setAmount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const onChange = (_: string, newAmount: number) => setAmount(newAmount);

    const buyMoreTries = async () => {
        if (!contract) return;

        try {
            setIsLoading(true);

            const tx = await contract.buyAiImageTry(amount);
            await tx.wait();

            setAiImageState((prev) => ({
                ...prev,
                tryCount: prev.tryCount + amount,
            }));
            setBalance((prev) => prev - AI_IMAGE_TRY_PRICE);
        } catch (error) {
            if (error instanceof Error) {
                toast(getBuyGeneratorTriesError(error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { buyMoreTries, onChange, amount, isLoading };
};
