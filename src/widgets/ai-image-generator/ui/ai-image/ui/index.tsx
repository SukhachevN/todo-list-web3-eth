import { FC, useRef, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import { AiImageGeneratorElementType, SavedAiImageType } from '@/shared/types';
import GenerateAiImage from '@/features/generate-ai-image';

import SaveAiImageModal from './save-ai-image-modal';

const AiImage: FC<AiImageGeneratorElementType> = ({
    aiImageState,
    balance,
    setAiImageState,
    setBalance,
}) => {
    const [img, setImg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [finalPrompt, setFinalPrompt] = useState('');
    const [savedAiImage, setSavedAiImage] = useState<SavedAiImageType | null>(
        null
    );
    const isWaitingAiImageNftMint = useRef(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const imgSrc = img ? img : savedAiImage?.image ?? '';

    return (
        <>
            <GenerateAiImage
                isLoading={isLoading}
                savedAiImage={savedAiImage}
                tryCount={aiImageState.tryCount}
                imgSrc={imgSrc}
                finalPrompt={finalPrompt}
                isWaitingAiImageNftMint={isWaitingAiImageNftMint}
                setAiImageState={setAiImageState}
                setFinalPrompt={setFinalPrompt}
                setImg={setImg}
                onOpen={onOpen}
                setIsLoading={setIsLoading}
                setSavedAiImage={setSavedAiImage}
            />
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
        </>
    );
};

export default AiImage;
