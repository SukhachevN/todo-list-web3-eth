import {
    Box,
    Button,
    Center,
    Input,
    Link,
    Spinner,
    Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

import {
    ETHERSCAN_PREFIX,
    NFT_CONTRACT_ADDRESS,
    aiImgPlaceholder,
} from '@/shared/constants';
import { SavedAiImageType } from '@/shared/types';

import { UseGenerateAiImageType, useGenerateAiImage } from './model';

type GenerateAiImageType = {
    isLoading: boolean;
    tryCount: number;
    imgSrc: string;
    finalPrompt: string;
    savedAiImage: SavedAiImageType | null;
    onOpen: () => void;
} & UseGenerateAiImageType;

const GenerateAiImage: FC<GenerateAiImageType> = ({
    isLoading,
    tryCount,
    imgSrc,
    finalPrompt,
    savedAiImage,
    onOpen,
    ...otherProps
}) => {
    const { input, isGenerating, onChange, handleGenerate } =
        useGenerateAiImage(otherProps);

    return (
        <Box w="100%" h="100%">
            <Box w="100%" display="flex" justifyContent="center" gap="20px">
                <Input
                    w="60%"
                    value={input}
                    onChange={onChange}
                    isDisabled={isGenerating}
                />
                <Button
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    isDisabled={!tryCount || isLoading}
                >
                    Generate
                </Button>
            </Box>
            {isGenerating && (
                <Center h="512px">
                    <Spinner w="100px" h="100px" />
                </Center>
            )}
            {imgSrc && !isGenerating && (
                <Box
                    mt="30px"
                    w="100%"
                    display="flex"
                    alignItems="center"
                    gap="20px"
                    flexDirection="column"
                >
                    <Image
                        src={imgSrc}
                        width={512}
                        height={512}
                        alt={finalPrompt}
                        placeholder="blur"
                        blurDataURL={aiImgPlaceholder}
                    />
                    <Text>{savedAiImage?.description ?? finalPrompt}</Text>
                    {savedAiImage?.nftId ? (
                        <Link
                            target="_blank"
                            href={`https://${ETHERSCAN_PREFIX}etherscan.io/nft/${NFT_CONTRACT_ADDRESS}/${savedAiImage.nftId}`}
                        >
                            View
                        </Link>
                    ) : (
                        <Button isLoading={isLoading} onClick={onOpen}>
                            {savedAiImage ? 'Mint NFT' : 'Save'}
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default GenerateAiImage;
