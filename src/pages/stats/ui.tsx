import { NextPage } from 'next/types';

import Disconnected from '@/widgets/disconnected';
import { Layout } from '@/shared/ui';
import Stats from '@/widgets/stats';
import { useWorkspace } from '@/app/providers/WorkspaceProvider';

const StatsPage: NextPage = () => {
    const { account, isChainIdCorrect } = useWorkspace();

    return (
        <Layout>
            {account && isChainIdCorrect ? <Stats /> : <Disconnected />}
        </Layout>
    );
};

export default StatsPage;
