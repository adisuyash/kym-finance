# Kym Finance

Kym Finance is a DeFi protocol that enables you to trade and maximize returns from yield-generating assets.

![Kym Finance](https://img.shields.io/badge/U2U-Nebulas%20Testnet-darkgreen) ![Solidity](https://img.shields.io/badge/Solidity-0.8.17-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black)

## Quick Links

- [Faucet - U2U Testnet](https://faucet.u2u.xyz/)
- [Explorer - U2U Testnet](https://testnet.u2uscan.xyz/)
- [Setup & Installation](#installation--setup)

## What is Kym?

```
Your Asset (U2U)
        ↓
    [Wrap]
      ↓
Wrapped Asset (wU2U)
        ↓
     [Split]
        ↓
   ┌────┴────┐
   ↓         ↓
  PT        YT
 (95%)     (5%)
Principal  Yield
   ↓         ↓
TRADE    TRADE
  or       or
 HOLD     HOLD
```

## How it works:

<img width="6317" height="3929" alt="kym-finance userflow" src="https://github.com/user-attachments/assets/febab3c6-5dd1-4d29-bc77-53acc6d2e7ea" />


1. Deposit U2U and wrap it to wU2U
2. Split wU2U into PT (principal) + YT (yield)
3. Trade PT/YT on the AMM or hold for yield
4. Redeem anytime or wait for maturity

## Core Features

### Smart Token Splitting
Transform your wU2U into two tradeable tokens:
- **PT (Principal Token)**: Represents your guaranteed principal (~95% of value)
- **YT (Yield Token)**: Captures future yield potential (~5% of value)

### Advanced Pricing
Uses time-value mathematics with discount factor formula: `PT = Amount × [1/(1+r)^t]`

**Instant Trading**
Swap PT ↔ YT tokens anytime with the built-in AMM (0.3% fee)

**Yield Optimization**
Hold YT tokens to accumulate and claim yields over time

**U2U Native**
Built specifically for U2U Network with optimized gas usage

## Architecture

### Smart Contracts

```
📁 contracts/
├── YieldSplitter.sol     # Core splitting logic with Pendle pricing
├── PrincipalToken.sol    # PT token (ERC20)
├── YieldToken.sol        # YT token (ERC20)
├── WrappedU2U.sol        # wU2U wrapper contract
├── MockAMM.sol           # AMM for PT/YT trading
└── OrochiOracle.sol      # Price oracle integration
```

### Frontend Architecture

```
📁 packages/app/src/
├── components/
│   ├── SplitSection.tsx       # wU2U → PT + YT splitting
│   ├── SwapSection.tsx        # PT ↔ YT trading
│   ├── RedeemSection.tsx      # Token redemption & yield claiming
│   ├── DepositSection.tsx     # U2U → wU2U wrapping
│   └── PortfolioOverview.tsx  # Portfolio analytics
├── config/
│   └── contracts.ts           # Contract addresses & ABIs
└── context/
    └── Web3.tsx               # Wallet connection & network config
```

## The Math Behind Kym

### Pricing Formula

Kym uses a time-value discount factor to split assets fairly:

```solidity
// Discount Factor: DF = 1 / (1 + r)^t
// Where: r = yield percentage, t = time to maturity (in years)

function calculatePendlePricing(uint256 amount) public view returns (uint256 ptAmount, uint256 ytAmount) {
    uint256 timeToMaturity = maturity - block.timestamp;
    uint256 yieldRate = (yieldPercentage * PRECISION) / BASIS_POINTS;
    uint256 timeFactor = (timeToMaturity * PRECISION) / SECONDS_PER_YEAR;

    // Linear approximation: (1 + r)^t ≈ 1 + r*t
    uint256 discountDenominator = PRECISION + (yieldRate * timeFactor) / PRECISION;

    // PT = amount * (1 / (1 + r*t))
    ptAmount = (amount * PRECISION) / discountDenominator;

    // YT = amount - PT
    ytAmount = amount - ptAmount;
}
```

### Example

Deposit **1.0 wU2U** with **5% APY** and **1 year maturity**:

```
Input:  1.0 wU2U
   ↓
You receive:
   • 0.9524 PT (95.24%) - Your principal
   • 0.0476 YT (4.76%) - Your yield rights
   ↓
Total: 1.0 wU2U (perfectly balanced)
```

**Why this split?**
- PT trades at a discount because it's locked until maturity
- YT captures the yield premium and can be traded immediately
- Together, they equal your original deposit

## Deployed Contracts

**Network:** U2U Nebulas Testnet | **Deployed:** September 30, 2025

| Contract           | Address                                      | Purpose                       |
| ------------------ | -------------------------------------------- | ----------------------------- |
| **WrappedU2U**     | `0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43` | U2U wrapper token             |
| **YieldSplitter**  | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | Core splitting logic          |
| **PrincipalToken** | `0x721944D878eAF967031E4Ef1101142ccDD773cF4` | PT-wU2U token                 |
| **YieldToken**     | `0xBFE70173B901Bb927F2cD23BE63964f240216f78` | YT-wU2U token                 |
| **OrochiOracle**   | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | Price oracle (Orochi Network) |
| **MockAMM**        | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | PT/YT trading pool (0.3% fee) |

### Network Details

- **Network Name**: U2U Nebulas Testnet
- **Chain ID**: `2484`
- **RPC URL**: `https://rpc-nebulas-testnet.u2u.xyz/`
- **Explorer**: `https://testnet.u2uscan.xyz/`
- **Currency**: U2U
- **Faucet**: `https://faucet.u2u.xyz/`

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
- Add network: Chain ID 2484, RPC: `https://rpc-nebulas-testnet.u2u.xyz/`

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## How to Use

### Step 1: Get Testnet U2U
1. Visit [U2U Faucet](https://faucet.u2u.xyz/)
2. Enter your wallet address
3. Receive testnet U2U tokens

### Step 2: Wrap Your U2U
1. Go to the **Deposit** page
2. Enter amount of U2U to wrap
3. Click "Wrap U2U" → Approve transaction
4. You now have wU2U!

### Step 3: Split into PT + YT
1. Go to the **Split** page
2. Enter amount of wU2U to split
3. See the breakdown: ~95% PT + ~5% YT
4. Click "Split wU2U" → Approve transaction
5. You now have PT and YT tokens!

### Step 4: Trade or Hold

**Option A: Trade on AMM**
- Go to **Swap** page
- Trade PT ↔ YT at market prices
- 0.3% trading fee applies

**Option B: Hold for Yield**
- Keep YT tokens to accumulate yield
- Go to **Redeem** page to claim
- Yield accrues over time

### Step 5: Redeem at Maturity
- After maturity date, redeem PT for full wU2U value
- Or redeem both PT + YT before maturity
- Unwrap wU2U back to U2U anytime

---

*Built with ❤️ for the VietBUIDL Hackathon*
