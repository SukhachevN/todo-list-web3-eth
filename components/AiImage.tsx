import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Input,
    Link,
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import type { BigNumber } from 'ethers';

import { AiImageGeneratorElementType, SavedAiImageType } from '@/utils/types';
import {
    ETHERSCAN_PREFIX,
    MAX_LOAD_AI_IMG_RETRY_COUNT,
    NFT_CONTRACT_ADDRESS,
    aiImgPlaceholder,
} from '@/utils/constants';
import {
    getLoadSavedAiImageError,
    getUseGeneratorTryError,
    loadAiImageError,
    loadTimeAiImageError,
    mintAImageNftAlert,
} from '@/utils/alerts';

import { useWorkspace } from './WorkspaceProvider';
import SaveAiImageModal from './SaveAiImageModal';

const AiImage: FC<AiImageGeneratorElementType> = ({
    aiImageState,
    balance,
    setAiImageState,
    setBalance,
}) => {
    const { contract, account } = useWorkspace();

    const [input, setInput] = useState('');
    const [img, setImg] = useState('');
    const [retry, setRetry] = useState(0);
    const [retryCount, setRetryCount] = useState(MAX_LOAD_AI_IMG_RETRY_COUNT);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [finalPrompt, setFinalPrompt] = useState('');
    const [savedAiImage, setSavedAiImage] = useState<SavedAiImageType | null>(
        null
    );
    const isWaitingAiImageNftMint = useRef(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const imgSrc = img ? img : savedAiImage?.image ?? '';

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const generateAction = async () => {
        if (isGenerating && !retry) return;

        setIsGenerating(true);

        if (retry > 0) {
            setRetryCount((prev) => (prev ? prev - 1 : 0));
            setRetry(0);
        }

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'image/png',
            },
            body: JSON.stringify({ input }),
        });

        const data = await response.json();

        if (response.status === 503) {
            setRetry(data.estimated_time);
            return;
        }

        if (!response.ok) {
            setIsGenerating(false);
            toast(loadAiImageError);
            return;
        }

        setFinalPrompt(input);
        setInput('');
        setImg(data.image);
        setIsGenerating(false);
        setSavedAiImage(null);
    };

    const handleGenerate = async () => {
        if (!contract) return;

        try {
            const tx = await contract.useAiImageTry();
            await tx.wait();

            setAiImageState((prev) => ({
                ...prev,
                tryCount: prev.tryCount - 1,
            }));
            generateAction();
        } catch (error) {
            if (error instanceof Error) {
                toast(getUseGeneratorTryError(error.message));
            }
        }
    };

    useEffect(() => {
        const runRetry = async () => {
            if (!retryCount) {
                toast(loadTimeAiImageError);
                setIsLoading(false);
                setRetryCount(MAX_LOAD_AI_IMG_RETRY_COUNT);
                return;
            }

            await new Promise<void>((resolve) =>
                setTimeout(() => resolve(), retry * 1000)
            );

            await generateAction();
        };

        if (!retry) return;

        runRetry();
    }, [retry]);

    useEffect(() => {
        const fetchData = async () => {
            if (!contract) return;

            try {
                setIsLoading(true);
                const savedAiImage = await contract.getSavedAiImage();
                setSavedAiImage({
                    ...savedAiImage,
                    nftId: savedAiImage.nftId.toNumber(),
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast(getLoadSavedAiImageError(error.message));
                }
            } finally {
                setIsLoading(false);
            }
        };

        const handleMintAiImageNFT = (
            creator: string,
            nftId: BigNumber,
            name: string,
            description: string,
            image: string
        ) => {
            if (
                creator.toLowerCase() === account &&
                isWaitingAiImageNftMint.current
            ) {
                setSavedAiImage({
                    name,
                    description,
                    image,
                    nftId: nftId.toNumber(),
                });
                toast(mintAImageNftAlert);
                isWaitingAiImageNftMint.current = false;
            }
        };

        contract?.on('NewAiImageNFT', handleMintAiImageNFT);

        fetchData();

        return () => {
            contract?.off('NewAchievementNFT', handleMintAiImageNFT);
        };
    }, [contract]);

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
                    isDisabled={!aiImageState.tryCount || isLoading}
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
            <SaveAiImageModal
                isWaitingAiImageNftMint={isWaitingAiImageNftMint}
                isOpen={isOpen}
                isLoading={isLoading}
                balance={balance}
                img={img}
                description={savedAiImage?.description ?? finalPrompt}
                savedAiImage={!img ? savedAiImage : null}
                setSavedAiImage={setSavedAiImage}
                setIsLoading={setIsLoading}
                onClose={onClose}
                setBalance={setBalance}
            />
        </Box>
    );
};

export default AiImage;
