import { NextPage } from 'next/types';

import Disconnected from '@/components/Disconnected';
import MainLayout from '@/components/MainLayout';
import Stats from '@/components/Stats';
import { useWorkspace } from '@/components/WorkspaceProvider';

const StatsPage: NextPage = () => {
    const { account, isChainIdCorrect } = useWorkspace();

    return (
        <MainLayout>
            {account && isChainIdCorrect ? <Stats /> : <Disconnected />}
        </MainLayout>
    );
};

export default StatsPage;
