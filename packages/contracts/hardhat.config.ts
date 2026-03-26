import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { configVariable, defineConfig } from 'hardhat/config';
import type { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    testnet: {
      url: configVariable('NEXT_PUBLIC_0G_CHAIN_RPC'),
      accounts: [configVariable('PRIVATE_KEY')],
      chainId: 16602,
      type: 'http',
    },
  },
};

export default defineConfig(config);
