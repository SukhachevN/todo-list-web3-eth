import { Button } from '@chakra-ui/react';

import { useConnectWallet } from './model';

const ConnectWalletButton = () => {
    const onClick = useConnectWallet();

    return <Button onClick={onClick}>Let's go!</Button>;
};

export default ConnectWalletButton;
