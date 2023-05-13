import { NextPage } from 'next';

import { useWorkspace } from '@/components/WorkspaceProvider';
import Disconnected from '@/components/Disconnected';
import MainLayout from '@/components/MainLayout';
import AiImageGenerator from '@/components/AiImageGenerator';

const AiImageGeneratorPage: NextPage = () => {
    const { account } = useWorkspace();

    return (
        <MainLayout>
            {account ? <AiImageGenerator /> : <Disconnected />}
        </MainLayout>
    );
};

export default AiImageGeneratorPage;
