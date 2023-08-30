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
} from '@chakra-ui/react';
import { FC } from 'react';

import { AI_IMAGE_TRY_PRICE } from '@/shared/constants';

import {
    UseBuyAiImageGeneratorTriesType,
    useBuyAiImageGeneratorTries,
} from './model';

type BuyAiImageGeneratorTriesType = UseBuyAiImageGeneratorTriesType & {
    balance: number;
    tryCount: number;
};

const BuyAiImageGeneratorTries: FC<BuyAiImageGeneratorTriesType> = ({
    tryCount,
    balance,
    ...otherProps
}) => {
    const { buyMoreTries, onChange, amount, isLoading } =
        useBuyAiImageGeneratorTries(otherProps);

    const tryWord = tryCount === 1 ? 'try' : 'tries';

    return (
        <Box display="flex" alignItems="center" gap="10px">
            You have
            <Text variant="gradient-main">{tryCount}</Text>
            {tryWord} and&nbsp;
            <Text variant="gradient-main">{balance} $TODO</Text>, buy more
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
    );
};

export default BuyAiImageGeneratorTries;
