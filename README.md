# Kym Finance

KYM Finance is a DeFi protocol that enables you to trade and maximize returns from yield-generating assets.

![Kym Finance](https://img.shields.io/badge/Base-Sepolia-blue) 
![Solidity](https://img.shields.io/badge/Solidity-0.8.17-purple) 
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) 
![Next.js](https://img.shields.io/badge/Next.js-15-black)

**Deployed on Vercel: https://kymfinance.vercel.app**

**X (Twitter): https://x.com/KymFinance**

## Deployed Contracts

### Network Configuration

- **Chain ID**: `84532`
- **Currency**: ETH
- **Network Name**: Base Sepolia Testnet
- **RPC URL**: `https://sepolia.base.org`

**Quick Links:** [Base Sepolia Explorer](https://sepolia.basescan.org) | [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

| Contract           | Address                                      | Purpose                       | Explorer Link |
| ------------------ | -------------------------------------------- | ----------------------------- |---------------|
| **WETH**           | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | ETH wrapper token             | [View](https://sepolia.basescan.org/address/0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4) |
| **YieldSplitter**  | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | Core splitting logic          | [View](https://sepolia.basescan.org/address/0xe702013eA3045D265720337127f06a6cCab4Fd15) |
| **PrincipalToken** | `0x1179a143dA25679e9FE46b8FD5194B76d9d1AFfd` | PT-WETH token                 | [View](https://sepolia.basescan.org/address/0x1179a143dA25679e9FE46b8FD5194B76d9d1AFfd) |
| **YieldToken**     | `0xfbbA21359Ebd8940dF2CcDb032f2093aa41f56cb` | YT-WETH token                 | [View](https://sepolia.basescan.org/address/0xfbbA21359Ebd8940dF2CcDb032f2093aa41f56cb) |
| **OrochiOracle**   | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | Price feed oracle             | [View](https://sepolia.basescan.org/address/0x5158337793D9913b5967B91a32bB328521D7C7fb) |
| **MockAMM**        | `0x3742409450A9262d828Aaf47b422ef8693DA2eCc` | Trading pool (0.3% fee)       | [View](https://sepolia.basescan.org/address/0x3742409450A9262d828Aaf47b422ef8693DA2eCc) |


## How it works

1. **Deposit ETH** and **wrap it to WETH**
2. **Split WETH** into **PT (principal) + YT (yield)**
3. **Trade PT/YT on the AMM** or hold for yield
4. **Redeem** anytime or wait for maturity


<table style="width:100%">
<tr>
<td style="width:35%; vertical-align:top; padding-right:10px;">

<pre>
   Your Asset (ETH)
          ↓
       [Wrap]
          ↓
Wrapped Asset (WETH)
          ↓
      [Split]
          ↓
    ┌─────┴─────┐
    ↓           ↓
   PT           YT
  (95%)        (5%)
Principal     Yield
(PT-WETH)    (YT-WETH)
</pre>

</td>
<td style="width:65%; vertical-align:top;">
<img src="https://github.com/user-attachments/assets/febab3c6-5dd1-4d29-bc77-53acc6d2e7ea" alt="kym-finance userflow" style="width:100%; height:auto;"/>
</td>
</tr>
</table>


## The Mathematics Behind Kym
Kym Finance uses a **time-value discount factor** to fairly split deposited assets into principal and yield tokens.

#### PT / YT Split Formula

The principal and yield token amounts are calculated as:

$$
PT = \frac{Amount}{(1 + r)^t} \quad and \quad YT = Amount - PT
$$

Where:  
- $PT$ = Principal Token amount  
- $YT$ = Yield Token amount  
- $Amount$ = Total underlying asset deposited  
- $r$ = Yield rate (decimal, e.g., 0.05 for 5%)  
- $t$ = Time to maturity in years (e.g., 1 for 1 year, 0.5 for 6 months)


### Solidity Implementation

```solidity
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
Deposit **1.0 WETH** with **5% APY** and **1 year maturity**:

```
Input: 1.0 WETH
     ↓
You receive:
   • 0.9524 PT (95.24%) - Principal
   • 0.0476 YT (4.76%) - Yield
     ↓
Total: 1.0 WETH (balanced)
```


**Rationale behind this split:**
- PT trades at a discount because it’s locked until maturity
- YT captures the yield premium and can be traded immediately
- Together, they equal your original deposit


## Architecture

### Smart Contracts

```
📂 contracts/
├── YieldSplitter.sol     # Core splitting logic with Pendle pricing
├── PrincipalToken.sol    # PT token (ERC20)
├── YieldToken.sol        # YT token (ERC20)
├── WETH.sol              # WETH wrapper contract
├── MockAMM.sol           # AMM for PT/YT trading
└── OrochiOracle.sol      # Price oracle integration
```

### Frontend

```
📂 app/src/
├── components/
│   ├── SplitSection.tsx       # WETH → PT + YT splitting
│   ├── SwapSection.tsx        # PT ↔ YT trading
│   ├── RedeemSection.tsx      # Token redemption & yield claiming
│   ├── DepositSection.tsx     # ETH → WETH wrapping
│   └── PortfolioOverview.tsx  # Portfolio analytics
├── config/
│   └── contracts.ts           # Contract addresses & ABIs
└── context/
    └── Web3.tsx               # Wallet connection & network config
```


## How to Use
For detailed setup, wallet connection, and usage instructions, please refer to our [Getting Started Guide](GETTING_STARTED.md).


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


<p align="center">Built with ❤️ for the VietBUIDL Hackathon</p>
