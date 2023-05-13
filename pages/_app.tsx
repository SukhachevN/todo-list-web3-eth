import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import { theme } from '@/utils/theme';
import { WorkspaceProvider } from '@/components/WorkspaceProvider';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => (
    <ChakraProvider theme={theme}>
        <WorkspaceProvider>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </WorkspaceProvider>
    </ChakraProvider>
);

export default App;
