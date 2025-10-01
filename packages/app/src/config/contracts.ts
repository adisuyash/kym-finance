// Contract addresses for different networks
// Update these addresses after deployment

export interface ContractAddresses {
  weth: `0x${string}`
  yieldSplitter: `0x${string}`
  principalToken: `0x${string}`
  yieldToken: `0x${string}`
  orochiOracle: `0x${string}`
  mockAMM: `0x${string}`
}

// Base Sepolia Testnet (Chain ID: 84532) - Deployed Addresses
// Deployed: 2025-10-01T18:18:59Z
export const BASE_SEPOLIA_ADDRESSES: ContractAddresses = {
  weth: '0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4',
  yieldSplitter: '0xe702013eA3045D265720337127f06a6cCab4Fd15',
  principalToken: '0x1179a143dA25679e9FE46b8FD5194B76d9d1AFfd',
  yieldToken: '0xfbbA21359Ebd8940dF2CcDb032f2093aa41f56cb',
  orochiOracle: '0x5158337793D9913b5967B91a32bB328521D7C7fb',
  mockAMM: '0x3742409450A9262d828Aaf47b422ef8693DA2eCc',
} as const

// Local Hardhat Network (Chain ID: 31337)
export const LOCAL_ADDRESSES: ContractAddresses = {
  // Deployed contract addresses from local deployment
  weth: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  yieldSplitter: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  principalToken: '0x75537828f2ce51be7289709686A69CbFDbB714F1',
  yieldToken: '0xE451980132E65465d0a498c53f0b5227326Dd73F',
  orochiOracle: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  mockAMM: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
}

// Get contract addresses based on chain ID
export function getContractAddresses(chainId: number): ContractAddresses {
  switch (chainId) {
    case 84532: // Base Sepolia Testnet
      return BASE_SEPOLIA_ADDRESSES
    case 31337: // Local Hardhat
      return LOCAL_ADDRESSES
    default:
      console.warn(`Unsupported chain ID: ${chainId}, falling back to Base Sepolia Testnet`)
      return BASE_SEPOLIA_ADDRESSES
  }
}

// Contract ABIs (minimal required functions)
export const YIELD_SPLITTER_ABI = [
  {
    name: 'depositAndSplit',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'redeemBeforeMaturity',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'redeemPTAfterMaturity',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'claimYield',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'yieldAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getUserPosition',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'ptBalance', type: 'uint256' },
      { name: 'ytBalance', type: 'uint256' },
      { name: 'claimableYield', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getContractStats',
    type: 'function',
    inputs: [],
    outputs: [
      { name: 'totalDeposited', type: 'uint256' },
      { name: 'totalYieldDistributed', type: 'uint256' },
      { name: 'maturity', type: 'uint256' },
      { name: 'isExpired', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'maturity',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'calculatePendlePricing',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [
      { name: 'ptAmount', type: 'uint256' },
      { name: 'ytAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'yieldPercentage',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
]

export const WETH_ABI = [
  {
    name: 'deposit',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'withdraw',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export const TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export const MOCK_AMM_ABI = [
  {
    name: 'swapPTForYT',
    type: 'function',
    inputs: [
      { name: 'ptAmount', type: 'uint256' },
      { name: 'minYTOut', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'swapYTForPT',
    type: 'function',
    inputs: [
      { name: 'ytAmount', type: 'uint256' },
      { name: 'minPTOut', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getSwapQuote',
    type: 'function',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'getPTPrice',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'getYTPrice',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const
