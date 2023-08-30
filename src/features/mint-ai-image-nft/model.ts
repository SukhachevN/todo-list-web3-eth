import { useToast } from '@chakra-ui/react';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import {
    getMintAiImageNftError,
    notEnoughTodoTokensError,
} from '@/shared/alerts';
import { GENERATE_AI_IMAGE_NFT_PRICE } from '@/shared/constants';
import { SavedAiImageType } from '@/shared/types';
import { handlePinImage } from '@/shared/helpers';

export type UseMintAiImageNftType = {
    balance: number;
    savedAiImage: SavedAiImageType | null;
    img: string;
    name: string;
    description: string;
    setIsLoading: (value: boolean) => void;
    isWaitingAiImageNftMint: MutableRefObject<boolean>;
    setBalance: Dispatch<SetStateAction<number>>;
    onClose: () => void;
};

export const useMintAiImageNft = ({
    balance,
    savedAiImage,
    img,
    name,
    description,
    isWaitingAiImageNftMint,
    setIsLoading,
    setBalance,
    onClose,
}: UseMintAiImageNftType) => {
    const { contract } = useWorkspace();

    const toast = useToast();

    const mintNft = async () => {
        if (!contract) return;

        // comment for testing
        if (balance < GENERATE_AI_IMAGE_NFT_PRICE) {
            toast(notEnoughTodoTokensError);
            return;
        }

        try {
            setIsLoading(true);

            const image =
                savedAiImage?.image ?? (await handlePinImage(img, name));

            const nftData = {
                name,
                description,
                image,
            };

            const tx = await contract.mintAiImageNFT(nftData);
            await tx.wait();

            isWaitingAiImageNftMint.current = true;

            setBalance((prev) => prev - GENERATE_AI_IMAGE_NFT_PRICE);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                toast(getMintAiImageNftError(error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return mintNft;
};
