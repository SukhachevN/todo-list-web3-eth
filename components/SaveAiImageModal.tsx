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
    Button,
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
    useToast,
} from '@chakra-ui/react';

import { SavedAiImageType } from '@/utils/types';
import { GENERATE_AI_IMAGE_NFT_PRICE } from '@/utils/constants';
import {
    addNameToNftError,
    getMintAiImageNftError,
    getSaveAiImageError,
    notEnoughTodoTokensError,
    saveAiImageAlert,
} from '@/utils/alerts';
import { handlePinImage } from '@/utils/handlers/handlePinImage';

import { useWorkspace } from './WorkspaceProvider';

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
    const { contract } = useWorkspace();

    const [name, setName] = useState(savedAiImage?.name ?? '');

    const toast = useToast();

    const isFormChanged = name !== savedAiImage?.name;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

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

    const mintNft = async () => {
        if (!contract) return;

        // comment for testing
        // if (balance < GENERATE_AI_IMAGE_NFT_PRICE) {
        //     toast(notEnoughTodoTokensError);
        //     return;
        // }

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
                    <Button
                        onClick={saveImage}
                        isDisabled={!isFormChanged}
                        isLoading={isLoading}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={mintNft}
                        isLoading={isLoading || isWaitingAiImageNftMint.current}
                    >
                        Mint NFT
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SaveAiImageModal;
