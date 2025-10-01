import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomicfoundation/hardhat-verify'
import '@typechain/hardhat'
import { CONFIG } from './utils/config'

// Suppress Node.js version warning
process.removeAllListeners('warning')

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
    alwaysGenerateOverloads: false,
    externalArtifacts: ['externalArtifacts/*.json'],
  },
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: CONFIG.ETHERSCAN_API_KEY || CONFIG.BASESCAN_API_KEY || 'dummy',
    customChains: [
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api?chainid=84532',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545',
    },
    // Base Sepolia Testnet (Primary Network)
    baseSepolia: {
      chainId: 84532,
      url: 'https://sepolia.base.org',
      accounts: CONFIG.DEPLOYER_KEY ? [CONFIG.DEPLOYER_KEY] : [],
      gasPrice: 'auto',
    },
    // Base Mainnet
    base: {
      chainId: 8453,
      url: 'https://mainnet.base.org',
      accounts: CONFIG.DEPLOYER_KEY ? [CONFIG.DEPLOYER_KEY] : [],
      gasPrice: 'auto',
    },
    // Ethereum networks (for reference)
    sepolia: {
      chainId: 11155111,
      url: 'https://rpc.sepolia.org/',
      accounts: CONFIG.DEPLOYER_KEY ? [CONFIG.DEPLOYER_KEY] : [],
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${CONFIG.INFURA_API_KEY}`,
      accounts: CONFIG.DEPLOYER_KEY ? [CONFIG.DEPLOYER_KEY] : [],
    },
  },
}

export default config
