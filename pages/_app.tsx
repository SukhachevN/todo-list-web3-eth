import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { theme } from '@/utils/theme';
import { WorkspaceProvider } from '@/components/WorkspaceProvider';

const App = ({ Component, pageProps }: AppProps) => (
    <ChakraProvider theme={theme}>
        <WorkspaceProvider>
            <Component {...pageProps} />
        </WorkspaceProvider>
    </ChakraProvider>
);

export default App;
