import { Center, Flex, Spinner } from '@chakra-ui/react';
import { FC } from 'react';

import { StatsStateType } from '@/shared/types';
import AchievementCard from '@/entities/achievement';

import { useAchievements } from './model';

type AchievementsType = {
    stats: StatsStateType | null;
};

const Achievements: FC<AchievementsType> = ({ stats }) => {
    const {
        isLoading,
        achievements,
        achievementsState,
        isWaitingAchievementMint,
    } = useAchievements();

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
