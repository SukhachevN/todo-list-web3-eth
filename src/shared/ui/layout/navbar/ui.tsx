import { Flex, Spacer, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';

const ActiveLink = dynamic(async () => await import('./active-link'), {
    ssr: false,
});

const NavBar = () => {
    const { account } = useWorkspace();

    const address = account
        ? `${account.slice(0, 5)}...${account.slice(-4)}`
        : 'Not connected';

    return (
        <Flex h="48px">
            <Flex gap="40px">
                <ActiveLink href="/">Todos</ActiveLink>
                <ActiveLink href="/stats">Stats</ActiveLink>
                <ActiveLink href="/ai-image-generator">
                    AI Image Generator
                </ActiveLink>
            </Flex>
            <Spacer />
            <Text
                variant="gradient-main"
                as="div"
                fontSize="2xl"
                title={account}
            >
                {address}
            </Text>
        </Flex>
    );
};

export default NavBar;
