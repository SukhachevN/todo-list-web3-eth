import { Center, Flex, Spinner, useToast } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import type { BigNumber } from 'ethers';

import {
    AchievementsStateType,
    AchievementsMetadataType,
    StatsStateType,
} from '@/utils/types';
import {
    getFetchAchievementsError,
    mintAchievementAlert,
} from '@/utils/alerts';
import { ACHIEVEMENTS } from '@/utils/constants';

import AchievementCard from './AchievementCard';
import { useWorkspace } from './WorkspaceProvider';

type AchievementsType = {
    stats: StatsStateType | null;
};

export const Achievements: FC<AchievementsType> = ({ stats }) => {
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

    return (
        <>
            {isLoading ? (
                <Center h="calc(100% - 200px)">
                    <Spinner w="100px" h="100px" />
                </Center>
            ) : (
                <Flex
                    wrap="wrap"
                    w="100%"
                    gap="20px"
                    justifyContent="center"
                    h="calc(100% - 200px)"
                    overflow="auto"
                    pb="20px"
                >
                    {achievements?.map((props) => (
                        <AchievementCard
                            {...props}
                            key={props.achievementKey}
                            stats={stats}
                            mintId={
                                achievementsState
                                    ? achievementsState[props.achievementKey]
                                    : null
                            }
                            isWaitingAchievementMint={isWaitingAchievementMint}
                        />
                    ))}
                </Flex>
            )}
        </>
    );
};

export default Achievements;
