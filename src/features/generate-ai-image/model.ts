import {
    ChangeEvent,
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { BigNumber } from 'ethers/lib/ethers';
import { useToast } from '@chakra-ui/react';

import { MAX_LOAD_AI_IMG_RETRY_COUNT } from '@/shared/constants';
import {
    getLoadSavedAiImageError,
    getUseGeneratorTryError,
    loadAiImageError,
    loadTimeAiImageError,
    mintAImageNftAlert,
} from '@/shared/alerts';
import { AiImageStateType, SavedAiImageType } from '@/shared/types';
import { useWorkspace } from '@/app/providers/WorkspaceProvider';

export type UseGenerateAiImageType = {
    setFinalPrompt: Dispatch<SetStateAction<string>>;
    setImg: Dispatch<SetStateAction<string>>;
    setSavedAiImage: Dispatch<SetStateAction<SavedAiImageType | null>>;
    setAiImageState: Dispatch<SetStateAction<AiImageStateType>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isWaitingAiImageNftMint: MutableRefObject<boolean>;
};

export const useGenerateAiImage = ({
    setFinalPrompt,
    setImg,
    setSavedAiImage,
    setAiImageState,
    setIsLoading,
    isWaitingAiImageNftMint,
}: UseGenerateAiImageType) => {
    const { contract, account } = useWorkspace();

    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [retry, setRetry] = useState(0);
    const [retryCount, setRetryCount] = useState(MAX_LOAD_AI_IMG_RETRY_COUNT);

    const toast = useToast();

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
            setIsGenerating(true);
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
            setIsGenerating(false);
        }
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
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

    return { input, isGenerating, onChange, handleGenerate };
};
