import { NextPage } from 'next';

import Disconnected from '@/widgets/disconnected';
import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { Layout } from '@/shared/ui';
import Main from '@/widgets/todo-list';

const MainPage: NextPage = () => {
    const { account, isChainIdCorrect } = useWorkspace();

    return (
        <Layout>
            {account && isChainIdCorrect ? <Main /> : <Disconnected />}
        </Layout>
    );
};

export default MainPage;
