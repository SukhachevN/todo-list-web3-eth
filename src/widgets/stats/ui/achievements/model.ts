import { useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers/lib/ethers';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import {
    AchievementsMetadataType,
    AchievementsStateType,
} from '@/shared/types';
import { ACHIEVEMENTS } from '@/shared/constants';
import {
    getFetchAchievementsError,
    mintAchievementAlert,
} from '@/shared/alerts';

export const useAchievements = () => {
    const { contract, account } = useWorkspace();

    const [achievements, setAchievements] = useState<
        AchievementsMetadataType[] | null
    >(null);

    const [achievementsState, setAchievementsState] =
        useState<AchievementsStateType | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const isWaitingAchievementMint = useRef(false);

    const toast = useToast();

    useEffect(() => {
        const fetchAchievements = async () => {
            if (contract) {
                setIsLoading(true);

                try {
                    const response = await fetch(ACHIEVEMENTS);
                    const { achievements } = await response.json();

                    const achievementsState =
                        await contract.getAchievementsState();

                    setAchievementsState(achievementsState);

                    setAchievements(achievements);
                } catch (error) {
                    if (error instanceof Error) {
                        toast(getFetchAchievementsError(error.message));
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const handleMintAchievementNFT = (
            creator: string,
            nftId: BigNumber,
            achievementKey: keyof AchievementsStateType
        ) => {
            if (
                creator.toLowerCase() === account &&
                isWaitingAchievementMint.current
            ) {
                setAchievementsState((prev) =>
                    prev
                        ? {
                              ...prev,
                              [achievementKey]: nftId,
                          }
                        : prev
                );
                toast(mintAchievementAlert);
                isWaitingAchievementMint.current = false;
            }
        };

        contract?.on('NewAchievementNFT', handleMintAchievementNFT);

        fetchAchievements();

        return () => {
            contract?.off('NewAchievementNFT', handleMintAchievementNFT);
        };
    }, [contract]);

    return {
        isLoading,
        achievements,
        achievementsState,
        isWaitingAchievementMint,
    };
};
