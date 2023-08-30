import { Button } from '@chakra-ui/react';
import { FC } from 'react';

import {
    InitializeAiImageCounterButtonType,
    useInitializeCounter,
} from './model';

const InitializeAiImageCounterButton: FC<InitializeAiImageCounterButtonType> = (
    props
) => {
    const { isLoading, initializeCounter } = useInitializeCounter(props);

    return (
        <Button isLoading={isLoading} onClick={initializeCounter}>
            Get 1 free try
        </Button>
    );
};

export default InitializeAiImageCounterButton;
