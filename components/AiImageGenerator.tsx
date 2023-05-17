import { useEffect, useState } from 'react';
import { Box, Center, Spinner, Text, VStack, useToast } from '@chakra-ui/react';

import { useWorkspace } from './WorkspaceProvider';
import TriesCount from './TriesCount';
import AiImage from './AiImage';

import { getFetchAiImageStateError } from '@/utils/alerts';
import { AiImageStateType } from '@/utils/types';

const AiImageGenerator = () => {
    const { contract, account } = useWorkspace();

    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [aiImageState, setAiImageState] = useState<AiImageStateType>({
        isInitialized: false,
        tryCount: 0,
    });
    const [isSectionUnlocked, setIsSectionUnlocked] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!contract || !account) return;

            setIsLoading(true);

            try {
                const stats = await contract.getStats();
                const balance = await contract.balanceOf(account);
                const aiImageState = await contract.getAiImageState();

                setIsSectionUnlocked(stats.created.toNumber() > 0);
                setBalance(balance.toNumber());
                setAiImageState({
                    ...aiImageState,
                    tryCount: aiImageState.tryCount.toNumber(),
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast(getFetchAiImageStateError(error.message));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [contract]);

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
                    Generate AI image by writing prompt. You can refer me as
                    "Nikita man" in your prompt to generate something with me.
                    Leave input empty to generate something absolutely random!
                    Try something like "Illustration of Lenin in cool hat, 4k,
                    by Leonardo da Vinci, portrait" use your fantasy!. Image
                    generation can take up to 5 minutes, please dont refresh
                    page before generating end.
                </Text>
                <TriesCount
                    aiImageState={aiImageState}
                    balance={balance}
                    setAiImageState={setAiImageState}
                    setBalance={setBalance}
                />
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
