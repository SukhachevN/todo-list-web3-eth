import { Button, Text, VStack, useToast } from '@chakra-ui/react';

import { getRequestAccountError, noMetaMaskError } from '@/utils/alerts';

const Disconnected = () => {
    const toast = useToast();

    const onClick = async () => {
        const { ethereum } = window;

        if (ethereum) {
            try {
                await ethereum.request({
                    method: 'eth_requestAccounts',
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast(getRequestAccountError(error.message));
                }
            }
        } else {
            toast(noMetaMaskError);
        }
    };

    return (
        <VStack spacing={30} pt={50}>
            <Text variant="gradient-main" fontSize="6xl" fontWeight="extrabold">
                Todo list on ethereum blockchain.
            </Text>
            <Text fontSize="2xl">
                Create todos, complete todos, get token rewards, mint nfts!
            </Text>
            <Button onClick={onClick}>Let's go!</Button>
        </VStack>
    );
};

export default Disconnected;
