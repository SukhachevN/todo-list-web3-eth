import { Button } from '@chakra-ui/react';
import { FC } from 'react';

import { UseSaveAiImageType, useSaveAiImage } from './model';

type SaveAiImageButtonType = {
    isLoading: boolean;
    isFormChanged: boolean;
} & UseSaveAiImageType;

const SaveAiImageButton: FC<SaveAiImageButtonType> = ({
    isFormChanged,
    isLoading,
    ...otherProps
}) => {
    const onClick = useSaveAiImage(otherProps);

    return (
        <Button
            onClick={onClick}
            isDisabled={!isFormChanged}
            isLoading={isLoading}
        >
            Save
        </Button>
    );
};

export default SaveAiImageButton;
