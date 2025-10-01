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
NEXT_PUBLIC_SITE_DESCRIPTION="Yield splitting protocol on U2U Network"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## Usage Guide

### 1. Connect Wallet

- Connect MetaMask to U2U Nebulas Testnet
- Add network: Chain ID `2484`, RPC: `https://rpc-nebulas-testnet.u2u.xyz/`

### 2. Get Test U2U

- Use U2U testnet faucet: https://faucet.u2u.xyz/
- Enter your wallet address and receive test U2U

### 3. Wrap U2U → wU2U

```typescript
// In Deposit section
1. Enter U2U amount
2. Click "Wrap U2U"
3. Confirm transaction
```

### 4. Split wU2U → PT + YT

```typescript
// In Split section
1. Enter wU2U amount to split
2. Click "Approve wU2U" (first time)
3. Click "Split X wU2U"
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
3. Redeem PT + YT back to wU2U at maturity
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

### Deploy to U2U Testnet

```bash
cd packages/hardhat

# Deploy all contracts
npx hardhat run scripts/deployToU2UTestnet.js --network u2uTestnet

# Initialize AMM pool
npx hardhat run scripts/initPool.js --network u2uTestnet
```

### Useful Scripts

```bash
# Check pool status
npx hardhat run scripts/checkPoolStatus.js --network u2uTestnet

# Setup demo data
npx hardhat run scripts/setupDemo.js --network u2uTestnet
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
