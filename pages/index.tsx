import { NextPage } from 'next';

import Disconnected from '@/components/Disconnected';
import { useWorkspace } from '@/components/WorkspaceProvider';
import MainLayout from '@/components/MainLayout';
import Main from '@/components/Main';

const MainPage: NextPage = () => {
    const { account } = useWorkspace();

    return <MainLayout> {account ? <Main /> : <Disconnected />}</MainLayout>;
};

export default MainPage;
