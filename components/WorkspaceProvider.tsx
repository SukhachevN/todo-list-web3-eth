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

import { getRequestAccountError, noMetaMaskError } from '@/utils/alerts';
import { TodoList, TodoList__factory } from '@/smart-contract/typechain-types';
import { CONTRACT_ADDRESS } from '@/utils/constants';

const WorkspaceContext = createContext<WorkspaceType>({});

type WorkspaceType = {
    account?: string;
    contract?: TodoList;
};

export const WorkspaceProvider: FC<PropsWithChildren> = ({ children }) => {
    const [account, setAccount] = useState<WorkspaceType['account']>();
    const [contract, setContract] = useState<WorkspaceType['contract']>();

    const toast = useToast();

    const workspace = {
        account,
        contract,
    };

    useEffect(() => {
        const loadContract = async () => {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const todoList = TodoList__factory.connect(
                    CONTRACT_ADDRESS,
                    signer
                );

                setContract(todoList);
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

                    console.log(accounts);

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
