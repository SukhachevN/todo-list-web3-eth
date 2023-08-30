import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getFetchStatsError } from '@/shared/alerts';
import { StatsStateType } from '@/shared/types';

export const useStats = () => {
    const { account, contract } = useWorkspace();

    const [stats, setStats] = useState<StatsStateType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const toast = useToast();

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

    return { stats, isLoading, balance };
};
