import { useToast } from '@chakra-ui/react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getRequestAccountError, noMetaMaskError } from '@/shared/alerts';

export const useConnectWallet = () => {
    const { isChainIdCorrect, switchChain } = useWorkspace();

    const toast = useToast();

    const onClick = async () => {
        const { ethereum } = window;

        if (ethereum) {
            try {
                await ethereum.request({
                    method: 'eth_requestAccounts',
                });

                !isChainIdCorrect && switchChain?.();
            } catch (error) {
                if (error instanceof Error) {
                    toast(getRequestAccountError(error.message));
                }
            }
        } else {
            toast(noMetaMaskError);
        }
    };

    return onClick;
};
