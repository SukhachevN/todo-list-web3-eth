import { Button } from '@chakra-ui/react';
import { FC } from 'react';

import { UseMintAiImageNftType, useMintAiImageNft } from './model';

type MintAiImageNftButtonType = {
    isLoading: boolean;
} & UseMintAiImageNftType;

const MintAiImageNftButton: FC<MintAiImageNftButtonType> = ({
    isLoading,
    isWaitingAiImageNftMint,
    ...otherProps
}) => {
    const onClick = useMintAiImageNft({
        isWaitingAiImageNftMint,
        ...otherProps,
    });

    return (
        <Button
            onClick={onClick}
            isLoading={isLoading || isWaitingAiImageNftMint.current}
        >
            Mint NFT
        </Button>
    );
};

export default MintAiImageNftButton;
