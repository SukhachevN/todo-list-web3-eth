import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
require('dotenv').config();

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.18',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    networks: {
        sepolia: {
            url: process.env.QUICKNODE_API_KEY_URL ?? '',
            accounts: [process.env.PRIVATE_KEY ?? ''],
        },
    },
};

export default config;
