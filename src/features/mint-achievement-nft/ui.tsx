import { Button, Link } from '@chakra-ui/react';
import { FC } from 'react';

import { ETHERSCAN_PREFIX, NFT_CONTRACT_ADDRESS } from '@/shared/constants';
import { AchievementCardType } from '@/shared/types';

import { useMintAchievementNft } from './model';

const MintAchievementButton: FC<
    Pick<
        AchievementCardType,
        'mintId' | 'statsStateKey' | 'amount' | 'isWaitingAchievementMint'
    >
> = (props) => {
    const { nftMintId, isMinting, mintNft } = useMintAchievementNft(props);

    return nftMintId ? (
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
};

export default MintAchievementButton;
