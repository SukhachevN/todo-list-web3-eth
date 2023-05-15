import { useEffect, useState } from 'react';
import { Box, useToast, Text, Divider } from '@chakra-ui/react';

import { StatsStateType } from '@/utils/types';
import { getFetchStatsError } from '@/utils/alerts';

import { useWorkspace } from './WorkspaceProvider';
import StatsInfo from './StatsInfo';
import Achievements from './Achievements';

const Stats = () => {
    const { account, contract } = useWorkspace();

    const [stats, setStats] = useState<StatsStateType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const toast = useToast();

    const created = stats?.created.toNumber() ?? 0;
    const completed = stats?.completed.toNumber() ?? 0;
    const deleted = stats?.deleted.toNumber() ?? 0;

    useEffect(() => {
        const fetchStats = async () => {
            if (contract && account) {
                setIsLoading(true);

                try {
                    const stats = await contract.getStats();

                    const balance = await contract.balanceOf(account);

                    setStats(stats);
                    setBalance(balance.toNumber());
                } catch (error) {
                    if (error instanceof Error) {
                        toast(getFetchStatsError(error.message));
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchStats();
    }, [contract]);

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
