import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';

import BuyAiImageGeneratorTries from '@/features/buy-ai-image-generator-tries/ui';
import InitializeAiImageCounterButton from '@/features/initialize-ai-image-counter/ui';

import AiImage from './ai-image';
import { useAiImageGenerator } from '../model';

const AiImageGenerator = () => {
    const {
        isLoading,
        isSectionUnlocked,
        aiImageState,
        balance,
        setAiImageState,
        setBalance,
    } = useAiImageGenerator();

    if (isLoading) {
        return (
            <Box h="100%">
                <Center h="100%">
                    <Spinner w="100px" h="100px" />
                </Center>
            </Box>
        );
    }

    if (!isSectionUnlocked) {
        return (
            <Box h="100%">
                <Text
                    mt="50px"
                    variant="gradient-main"
                    textAlign="center"
                    fontSize="2xl"
                >
                    Create at least 1 todo to unlock this section
                </Text>
            </Box>
        );
    }

    return (
        <Box w="100%">
            <VStack pt="15px" w="100%" display="flex" spacing="15px">
                <Text textAlign="center" p="0 10px">
                    Generate AI image by writing prompt. Leave input empty to
                    generate something absolutely random! Try something like
                    "Illustration of Lenin in cool hat, 4k, by Leonardo da
                    Vinci, portrait" use your fantasy! Image generation can take
                    up to 5 minutes, please dont refresh page before generating
                    end.
                </Text>
                <Box display="flex" justifyContent="center" w="100%">
                    {aiImageState.isInitialized ? (
                        <BuyAiImageGeneratorTries
                            tryCount={aiImageState.tryCount}
                            balance={balance}
                            setAiImageState={setAiImageState}
                            setBalance={setBalance}
                        />
                    ) : (
                        <InitializeAiImageCounterButton
                            setAiImageState={setAiImageState}
                        />
                    )}
                </Box>
                <AiImage
                    aiImageState={aiImageState}
                    balance={balance}
                    setAiImageState={setAiImageState}
                    setBalance={setBalance}
                />
            </VStack>
        </Box>
    );
};

export default AiImageGenerator;
