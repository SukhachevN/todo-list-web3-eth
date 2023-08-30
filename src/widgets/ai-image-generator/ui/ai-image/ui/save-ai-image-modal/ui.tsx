import {
    ChangeEvent,
    Dispatch,
    FC,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import {
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';

import { SavedAiImageType } from '@/shared/types';
import { GENERATE_AI_IMAGE_NFT_PRICE } from '@/shared/constants';
import SaveAiImageButton from '@/features/save-ai-image';
import MintAiImageNftButton from '@/features/mint-ai-image-nft';

type SaveAiImageModalType = {
    isWaitingAiImageNftMint: MutableRefObject<boolean>;
    isOpen: boolean;
    isLoading: boolean;
    img: string;
    description: string;
    savedAiImage: SavedAiImageType | null;
    balance: number;
    onClose: () => void;
    setIsLoading: (value: boolean) => void;
    setSavedAiImage: (savedImage: SavedAiImageType | null) => void;
    setBalance: Dispatch<SetStateAction<number>>;
};

const SaveAiImageModal: FC<SaveAiImageModalType> = ({
    isWaitingAiImageNftMint,
    isOpen,
    isLoading,
    img,
    description,
    savedAiImage,
    balance,
    onClose,
    setIsLoading,
    setSavedAiImage,
    setBalance,
}) => {
    const [name, setName] = useState(savedAiImage?.name ?? '');

    const isFormChanged = name !== savedAiImage?.name;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    useEffect(() => {
        setName(savedAiImage?.name ?? '');
    }, [savedAiImage]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent h="350px">
                <ModalHeader>
                    <Text variant="gradient-main">AI Image</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        You can create NFT of your AI Image for&nbsp;
                        <Text variant="gradient-main" as="span">
                            {GENERATE_AI_IMAGE_NFT_PRICE} $TODO
                        </Text>
                        , or just save it for&nbsp;
                        <Text variant="gradient-main" as="span">
                            free
                        </Text>
                        &nbsp;to mint NFT later.
                    </Text>
                    <FormControl pt="20px">
                        <FormLabel>Name:</FormLabel>
                        <Input value={name} onChange={onChange} />
                        <FormHelperText>Give name to your NFT</FormHelperText>
                    </FormControl>
                </ModalBody>
                <ModalFooter gap="10px">
                    <SaveAiImageButton
                        isLoading={isLoading}
                        isFormChanged={isFormChanged}
                        name={name}
                        description={description}
                        img={img}
                        setIsLoading={setIsLoading}
                        setSavedAiImage={setSavedAiImage}
                        onClose={onClose}
                    />
                    <MintAiImageNftButton
                        isLoading={isLoading}
                        name={name}
                        description={description}
                        img={img}
                        setIsLoading={setIsLoading}
                        onClose={onClose}
                        isWaitingAiImageNftMint={isWaitingAiImageNftMint}
                        balance={balance}
                        setBalance={setBalance}
                        savedAiImage={savedAiImage}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SaveAiImageModal;
