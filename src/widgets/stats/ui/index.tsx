import { Box, Text, Divider } from '@chakra-ui/react';

import StatsInfo from './info';
import Achievements from '@/components/Achievements';
import { useStats } from '../model';

const Stats = () => {
    const { stats, isLoading, balance } = useStats();

    const created = stats?.created.toNumber() ?? 0;
    const completed = stats?.completed.toNumber() ?? 0;
    const deleted = stats?.deleted.toNumber() ?? 0;

    return (
        <Box h="100%">
            {!isLoading && !stats ? (
                <Text
                    mt="50px"
                    textAlign="center"
                    fontSize="2xl"
                    variant="gradient-main"
                >
                    Create at least 1 todo to unlock this section
                </Text>
            ) : (
                stats && (
                    <>
                        <StatsInfo
                            isLoading={isLoading}
                            created={created}
                            completed={completed}
                            deleted={deleted}
                            balance={balance}
                        />
                        <Divider m="20px 0" />
                        <Achievements stats={stats} />
                    </>
                )
            )}
        </Box>
    );
};

export default Stats;
