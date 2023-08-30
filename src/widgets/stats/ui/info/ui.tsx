import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { FC } from 'react';

type StatsInfoType = {
    isLoading: boolean;
    created: number;
    completed: number;
    deleted: number;
    balance: number;
};

const StatsInfo: FC<StatsInfoType> = ({
    isLoading,
    created,
    completed,
    deleted,
    balance,
}) => (
    <Flex gap="50px">
        <Box>
            <Flex fontSize="2xl" align="center">
                Created:&nbsp;
                {isLoading ? (
                    <Skeleton w="100px" h="24px" />
                ) : (
                    <Text variant="gradient-1">{created}</Text>
                )}
            </Flex>
            <Flex fontSize="2xl" align="center">
                Completed:&nbsp;
                {isLoading ? (
                    <Skeleton w="100px" h="24px" />
                ) : (
                    <Text variant="gradient-2">{completed}</Text>
                )}
            </Flex>
            <Flex fontSize="2xl" align="center">
                Deleted:&nbsp;
                {isLoading ? (
                    <Skeleton w="100px" h="24px" />
                ) : (
                    <Text variant="gradient-3">{deleted}</Text>
                )}
            </Flex>
            <Flex fontSize="2xl" align="center">
                Balance:&nbsp;
                {isLoading ? (
                    <Skeleton w="100px" h="24px" />
                ) : (
                    <Text variant="gradient-main">
                        {balance}
                        &nbsp;$TODO
                    </Text>
                )}
            </Flex>
        </Box>
    </Flex>
);

export default StatsInfo;
