import Head from 'next/head';
import { Box, Spacer } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import NavBar from './navbar';

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <Box>
        <Head>
            <title>Todo list web3</title>
            <meta name="Todo list on ethereum blockchain" />
            <link rel="icon" href="/ethereumLogo.svg" />
        </Head>
        <Box h="100vh" padding={4}>
            <NavBar />
            <Spacer />
            <Box h="calc(100% - 82px)">{children}</Box>
        </Box>
    </Box>
);

export default MainLayout;
