## Installation & Setup

### Prerequisites

- Node.js 18+
- Yarn or npm
- MetaMask or compatible wallet

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/kym-finance
cd kym-finance

# Install dependencies
npm install

# Start development server
cd packages/app
npm run dev
```

### Environment Setup

Create `.env.local` in `packages/app/`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SITE_NAME="Kym Finance"
NEXT_PUBLIC_SITE_DESCRIPTION="Yield splitting protocol on Base Sepolia"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## Usage Guide

**Kym Finance is already deployed at:** [https://kymfinance.vercel.app](https://kymfinance.vercel.app/)

### 1. Connect Wallet

- Connect MetaMask to Base Sepolia Testnet
- Add network: Chain ID `84532`, RPC: `https://sepolia.base.org`

### 2. Get Test ETH

- Use Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Enter your wallet address and receive test ETH

### 3. Wrap ETH → WETH

```typescript
// In Deposit section
1. Enter ETH amount
2. Click "Wrap ETH"
3. Confirm transaction
```

### 4. Split wETH → PT + YT

```typescript
// In Split section
1. Enter wETH amount to split
2. Click "Approve wETH" (first time)
3. Click "Split X wETH"
4. Receive PT + YT tokens with Pendle pricing
```

### 5. Trade PT ↔ YT

```typescript
// In Swap section
1. Select from token (PT or YT)
2. Enter amount
3. Set yield parameters (auto-filled)
4. Click "Approve" then "Swap"
```

### 6. Claim Yield & Redeem

```typescript
// In Redeem section
1. View accumulated yield from YT tokens
2. Click "Claim Yield" to harvest
3. Redeem PT + YT back to wETH at maturity
```

## Development & Testing

### Run Local Development

```bash
# Start frontend
cd packages/app
npm run dev

# Compile contracts
cd packages/hardhat
npx hardhat compile

# Run tests
npx hardhat test
```

### Deploy to ETH Testnet

```bash
cd packages/hardhat

# Deploy all contracts
npx hardhat run scripts/deployToETHTestnet.js --network ethTestnet

# Initialize AMM pool
npx hardhat run scripts/initPool.js --network ethTestnet
```

### Useful Scripts

```bash
# Check pool status
npx hardhat run scripts/checkPoolStatus.js --network ethTestnet

# Setup demo data
npx hardhat run scripts/setupDemo.js --network ethTestnet
```

## Technical Implementation

### Smart Contract Features

```solidity
contract YieldSplitter {
    // Pendle-style pricing parameters
    uint256 public yieldPercentage; // 500 = 5% APY
    uint256 public constant BASIS_POINTS = 10000;

    // Core splitting function
    function depositAndSplit(uint256 amount) external {
        (uint256 ptAmount, uint256 ytAmount) = calculatePendlePricing(amount);
        principalToken.mint(msg.sender, ptAmount);
        yieldToken.mint(msg.sender, ytAmount);
    }
}
```

### Frontend Integration

```typescript
// Contract interaction with proper typing
const { writeContract } = useWriteContract()

const handleSplit = async () => {
  await writeContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'depositAndSplit',
    args: [parseEther(amount)],
  })
}
```

## Deployment

#### Network Configuration

- **Chain ID:** 2484
- **Network:** ETH Nebulas Testnet (or any preferred network)
- RPC URL: `https://rpc-nebulas-testnet.eth.xyz`
- Extras: [ETH Explorer](https://testnet.ethscan.xyz/) | [ETH Faucet](https://faucet.eth.xyz/)

#### Frontend Integration
- Addresses updated in: `packages/app/src/config/contracts.ts`  
- Frontend automatically connects to ETH Nebulas Testnet (Chain ID: 2484)

#### ABIs Location
- Minimal ABIs: `packages/app/src/config/contracts.ts`  
- Full ABIs: `packages/hardhat/artifacts/contracts/*/[ContractName].json`  
- TypeChain Types: `packages/hardhat/typechain-types/`

#### Verification
```bash
cd packages/hardhat
npx hardhat verify --network ethTestnet <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

Next Steps:
- ✅ Contracts deployed successfully
- ✅ Frontend addresses updated
- 🔄 Optional: Run demo script
```bash
cd packages/hardhat
npx hardhat run scripts/setupDemo.js --network ethTestnet
```
- 🔄 Test full user flow on frontend
- 🔄 Verify contracts on ETH Scan (optional)

### Vercel Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_production_id
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```
