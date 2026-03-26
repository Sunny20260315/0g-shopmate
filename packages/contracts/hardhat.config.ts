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
      url: process.env.NEXT_PUBLIC_0G_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 16602, // 0G 测试网 Chain ID
      type: 'http',
    },
  },
};

export default defineConfig(config);