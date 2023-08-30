import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import {
    achievementActionType,
    achievementAmountCodes,
} from '@/shared/constants';
import { AchievementCardType } from '@/shared/types';
import { getMintAchievementError } from '@/shared/alerts';

export const useMintAchievementNft = ({
    mintId,
    statsStateKey,
    amount,
    isWaitingAchievementMint,
}: Pick<
    AchievementCardType,
    'mintId' | 'statsStateKey' | 'amount' | 'isWaitingAchievementMint'
>) => {
    const { contract } = useWorkspace();

    const [nftMintId, setNftMintId] = useState(mintId);
    const [isMinting, setIsMinting] = useState(false);

    const toast = useToast();

    const mintNft = async () => {
        if (nftMintId || !contract) return;

        try {
            setIsMinting(true);

            const tx = await contract.mintAchievementNFT({
                actionType: achievementActionType[statsStateKey],
                amount: achievementAmountCodes[amount],
            });
            await tx.wait();

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

    return { nftMintId, isMinting, mintNft };
};
