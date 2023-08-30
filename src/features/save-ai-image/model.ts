import { useToast } from '@chakra-ui/react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import {
    addNameToNftError,
    getSaveAiImageError,
    saveAiImageAlert,
} from '@/shared/alerts';
import { SavedAiImageType } from '@/shared/types';
import { handlePinImage } from '@/shared/helpers';

export type UseSaveAiImageType = {
    name: string;
    img: string;
    description: string;
    setIsLoading: (value: boolean) => void;
    setSavedAiImage: (savedImage: SavedAiImageType | null) => void;
    onClose: () => void;
};

export const useSaveAiImage = ({
    name,
    img,
    description,
    setIsLoading,
    setSavedAiImage,
    onClose,
}: UseSaveAiImageType) => {
    const { contract } = useWorkspace();

    const toast = useToast();

    const saveImage = async () => {
        if (!contract) return;

        if (!name) {
            toast(addNameToNftError);
            return;
        }

        try {
            setIsLoading(true);

            const image = await handlePinImage(img, name);
            const tx = await contract.saveAiImage({ name, description, image });
            await tx.wait();

            setSavedAiImage({
                name,
                description,
                image,
                nftId: 0,
            });

            toast(saveAiImageAlert);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                toast(getSaveAiImageError(error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return saveImage;
};
