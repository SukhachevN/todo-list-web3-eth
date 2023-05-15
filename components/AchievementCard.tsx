import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
    Progress,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FC, MutableRefObject, useEffect, useState } from 'react';
import type { BigNumber } from 'ethers';

import { getMintAchievementError } from '@/utils/alerts';
import { AchievementsMetadataType, StatsStateType } from '@/utils/types';
import {
    ETHERSCAN_PREFIX,
    NFT_CONTRACT_ADDRESS,
    achievementActionType,
    achievementAmountCodes,
    imgPlaceholder,
} from '@/utils/constants';

import { useWorkspace } from './WorkspaceProvider';

type AchievementCardType = {
    mintId: BigNumber | null;
    stats: StatsStateType | null;
    isWaitingAchievementMint: MutableRefObject<boolean>;
} & AchievementsMetadataType;

const AchievementCard: FC<AchievementCardType> = ({
    mintId,
    image,
    title,
    stats,
    amount,
    statsStateKey,
    description,
    isWaitingAchievementMint,
}) => {
    const { contract } = useWorkspace();

    const [nftMintId, setNftMintId] = useState(mintId);
    const [isMinting, setIsMinting] = useState(false);

    const toast = useToast();

    const currentAmount = stats ? stats[statsStateKey].toNumber() : 0;

    const isDisabled = currentAmount < amount;

    const mintNft = async () => {
        if (nftMintId || !contract) return;

        try {
            setIsMinting(true);

            await contract.mintAchievementNFT({
                actionType: achievementActionType[statsStateKey],
                amount: achievementAmountCodes[amount],
            });

            isWaitingAchievementMint.current = true;
        } catch (error) {
            if (error instanceof Error) {
                toast(getMintAchievementError(error.message));
            }
        }
    };

    useEffect(() => {
        if (mintId?.toNumber() && !nftMintId) setIsMinting(false);

        setNftMintId(mintId?.toNumber() ? mintId : null);
    }, [mintId]);

    const UnlockedAchievementFooter = () =>
        nftMintId ? (
            <Link
                target="_blank"
                href={`https://${ETHERSCAN_PREFIX}etherscan.io/nft/${NFT_CONTRACT_ADDRESS}/${nftMintId.toNumber()}`}
            >
                View
            </Link>
        ) : (
            <Button onClick={mintNft} isLoading={isMinting}>
                Mint
            </Button>
        );

    return (
        <Card
            h="320px"
            w="300px"
            filter={isDisabled ? 'grayscale(1)' : ''}
            cursor={isDisabled ? 'not-allowed' : ''}
        >
            <CardHeader textAlign="center">{title}</CardHeader>
            <CardBody pt={0} display="flex" justifyContent="center">
                <Tooltip label={description}>
                    <Box
                        borderRadius="10px"
                        overflow="hidden"
                        w="150px"
                        h="150px"
                    >
                        <Image
                            alt={title}
                            width={150}
                            height={150}
                            src={image}
                            placeholder="blur"
                            blurDataURL={imgPlaceholder}
                        />
                    </Box>
                </Tooltip>
            </CardBody>
            <CardFooter
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="80px"
            >
                {isDisabled ? (
                    <Tooltip label={`${currentAmount}/${amount}`}>
                        <Progress
                            value={currentAmount}
                            max={amount}
                            hasStripe
                            w="100%"
                        />
                    </Tooltip>
                ) : (
                    <UnlockedAchievementFooter />
                )}
            </CardFooter>
        </Card>
    );
};

export default AchievementCard;
