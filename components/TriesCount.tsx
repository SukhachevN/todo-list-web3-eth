import { FC, useState } from 'react';
import {
    Box,
    Button,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';

import {
    getBuyGeneratorTriesError,
    getInitializeAiImageStateError,
} from '@/utils/alerts';
import { AI_IMAGE_TRY_PRICE } from '@/utils/constants';
import { AiImageGeneratorElementType } from '@/utils/types';

import { useWorkspace } from './WorkspaceProvider';

const TriesCount: FC<AiImageGeneratorElementType> = ({
    balance,
    aiImageState,
    setBalance,
    setAiImageState,
}) => {
    const { contract } = useWorkspace();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(1);

    const toast = useToast();

    const tryWord = aiImageState.tryCount === 1 ? 'try' : 'tries';

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

    const onChange = (_: string, newAmount: number) => setAmount(newAmount);

    return (
        <Box display="flex" justifyContent="center" w="100%">
            {aiImageState.isInitialized ? (
                <Box display="flex" alignItems="center" gap="10px">
                    You have
                    <Text variant="gradient-main">{aiImageState.tryCount}</Text>
                    {tryWord} and&nbsp;
                    <Text variant="gradient-main">{balance} $TODO</Text>, buy
                    more
                    <NumberInput
                        defaultValue={1}
                        min={1}
                        w="100px"
                        onChange={onChange}
                        isDisabled={isLoading}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Tooltip label={`1 try = ${AI_IMAGE_TRY_PRICE} $TODO`}>
                        <Button
                            isLoading={isLoading}
                            onClick={buyMoreTries}
                            isDisabled={balance < AI_IMAGE_TRY_PRICE * amount}
                        >
                            Buy
                        </Button>
                    </Tooltip>
                </Box>
            ) : (
                <Button isLoading={isLoading} onClick={initializeCounter}>
                    Get 1 free try
                </Button>
            )}
        </Box>
    );
};

export default TriesCount;
