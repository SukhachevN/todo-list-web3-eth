import { useToast } from '@chakra-ui/react';
import {
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { ethers } from 'ethers';

import {
    getLoadContractError,
    getRequestAccountError,
    getSwitchChainError,
    noMetaMaskError,
} from '@/utils/alerts';
import { TodoList, TodoList__factory } from '@/smart-contract/typechain-types';
import { CHAIN_ID, CONTRACT_ADDRESS } from '@/utils/constants';

const WorkspaceContext = createContext<WorkspaceType>({});

type WorkspaceType = {
    account?: string;
    contract?: TodoList;
    isChainIdCorrect?: boolean;
    switchChain?: () => void;
};

export const WorkspaceProvider: FC<PropsWithChildren> = ({ children }) => {
    const [account, setAccount] = useState<WorkspaceType['account']>();
    const [contract, setContract] = useState<WorkspaceType['contract']>();
    const [isChainIdCorrect, setIsChainIdCorrect] = useState(true);

    const toast = useToast();

    const switchChain = async () => {
        const { ethereum } = window;
        if (ethereum) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CHAIN_ID }],
                });
                setIsChainIdCorrect(true);
                location.reload();
            } catch (error) {
                if (error instanceof Error) {
                    toast(getSwitchChainError(error.message));
                }
            }
        } else {
            toast(noMetaMaskError);
        }
    };

    const workspace = {
        account,
        contract,
        isChainIdCorrect,
        switchChain,
    };

    useEffect(() => {
        const loadContract = async () => {
            const { ethereum } = window;

            if (ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(
                        ethereum
                    );
                    const signer = provider.getSigner();
                    const todoList = TodoList__factory.connect(
                        CONTRACT_ADDRESS,
                        signer
                    );
                    const chainId = await ethereum.request({
                        method: 'eth_chainId',
                    });

                    setIsChainIdCorrect(chainId === CHAIN_ID);
                    setContract(todoList);
                } catch (error) {
                    if (error instanceof Error) {
                        toast(getLoadContractError(error.message));
                    }
                }
            } else {
                toast(noMetaMaskError);
            }
        };

        account && loadContract();
    }, [account]);

    useEffect(() => {
        const loadAccount = async () => {
            const { ethereum } = window;

            if (ethereum) {
                try {
                    const accounts = await ethereum.request({
                        method: 'eth_accounts',
                    });

                    setAccount(accounts[0] ?? null);
                } catch (error) {
                    if (error instanceof Error) {
                        toast(getRequestAccountError(error.message));
                    }
                }
            } else {
                toast(noMetaMaskError);
            }
        };

        loadAccount();

        window.ethereum?.on('accountsChanged', loadAccount);
        window.ethereum?.on('chainChanged', loadAccount);

        return () => {
            window.ethereum?.removeListener('accountsChanged', loadAccount);
            window.ethereum?.removeListener('chainChanged', loadAccount);
        };
    }, []);

    return (
        <WorkspaceContext.Provider value={workspace}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);
