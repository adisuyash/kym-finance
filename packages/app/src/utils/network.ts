// import { mainnet, arbitrum, base, polygon, optimism } from '@reown/appkit/networks'
// import { sepolia } from '@reown/appkit/networks'

// U2U Nebulas Testnet configuration
// Using the same structure as other networks to avoid TypeScript issues
export const u2uTestnet = {
  id: 2484,
  name: 'U2U Nebulas Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2UNetwork',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-nebulas-testnet.u2u.xyz/'],
    },
    public: {
      http: ['https://rpc-nebulas-testnet.u2u.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'U2U Nebulas Testnet Explorer',
      url: 'https://testnet.u2uscan.xyz/',
    },
  },
  testnet: true,
} as const

// U2U Solaris Mainnet configuration
export const u2uMainnet = {
  id: 39,
  name: 'U2U Solaris Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2UNetwork',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-mainnet.u2u.xyz/'],
    },
    public: {
      http: ['https://rpc-mainnet.u2u.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'U2U Mainnet Explorer',
      url: 'https://u2uscan.xyz/',
    },
  },
  testnet: false,
} as const

// U2U Networks - Testnet and Mainnet
export const ETH_CHAINS = [u2uMainnet, u2uTestnet]

export const NETWORK_COLORS = {
  u2u: {
    color: 'emerald',
    bgVariant: 'bg-emerald-600',
  },
  ethereum: {
    color: 'green',
    bgVariant: 'bg-green-600',
  },
  arbitrum: {
    color: 'sky',
    bgVariant: 'bg-sky-600',
  },
  base: {
    color: 'blue',
    bgVariant: 'bg-blue-600',
  },
  linea: {
    color: 'slate',
    bgVariant: 'bg-slate-600',
  },
  polygon: {
    color: 'purple',
    bgVariant: 'bg-purple-600',
  },
  optimism: {
    color: 'red',
    bgVariant: 'bg-red-600',
  },
  scroll: {
    color: 'amber',
    bgVariant: 'bg-amber-600',
  },
  other: {
    color: 'gray',
    bgVariant: 'bg-gray-600',
  },
}

export function GetNetworkColor(chain?: string, type: 'color' | 'bgVariant' = 'color') {
  chain = chain?.toLocaleLowerCase()
  if (chain?.includes('u2u')) return NETWORK_COLORS.u2u[type]
  if (chain === 'ethereum' || chain === 'mainnet' || chain === 'homestead') return NETWORK_COLORS.ethereum[type]
  if (chain?.includes('arbitrum')) return NETWORK_COLORS.arbitrum[type]
  if (chain?.includes('base')) return NETWORK_COLORS.base[type]
  if (chain?.includes('linea')) return NETWORK_COLORS.linea[type]
  if (chain?.includes('polygon') || chain?.includes('matic')) return NETWORK_COLORS.polygon[type]
  if (chain?.includes('optimism') || chain?.startsWith('op')) return NETWORK_COLORS.optimism[type]
  if (chain?.includes('scroll')) return NETWORK_COLORS.scroll[type]

  return NETWORK_COLORS.other[type]
}
