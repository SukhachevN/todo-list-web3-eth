import { NextPage } from 'next';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import Disconnected from '@/widgets/disconnected';
import { Layout } from '@/shared/ui';
import AiImageGenerator from '@/widgets/ai-image-generator';

const AiImageGeneratorPage: NextPage = () => {
    const { account, isChainIdCorrect } = useWorkspace();

    return (
        <Layout>
            {account && isChainIdCorrect ? (
                <AiImageGenerator />
            ) : (
                <Disconnected />
            )}
        </Layout>
    );
};

export default AiImageGeneratorPage;
