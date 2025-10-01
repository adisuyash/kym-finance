# Kym Finance

KYM Finance is a DeFi protocol that enables you to trade and maximize returns from yield-generating assets.

![Kym Finance](https://img.shields.io/badge/U2U-Nebulas%20Testnet-darkgreen) 
![Solidity](https://img.shields.io/badge/Solidity-0.8.17-purple) 
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) 
![Next.js](https://img.shields.io/badge/Next.js-15-black)

**Deployed on Vercel: https://kymfinance.vercel.app**

**X (Twitter): https://x.com/KymFinance**

## Deployed Contracts

### Network Configuration

- **Chain ID**: `2484`
- **Currency**: U2U
- **Network Name**: U2U Nebulas Testnet
- **RPC URL**: `https://rpc-nebulas-testnet.u2u.xyz/`

**Quick Links:** [U2U Testnet Explorer](https://testnet.u2uscan.xyz) | [U2U Faucet](https://faucet.u2u.xyz)
| Contract           | Address                                      | Purpose                       | Explorer Link |
| ------------------ | -------------------------------------------- | ----------------------------- |---------------|
| **WrappedU2U**     | `0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43` | U2U wrapper token             | [View](https://testnet.u2uscan.xyz/address/0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43) |
| **YieldSplitter**  | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | Core splitting logic          | [View](https://testnet.u2uscan.xyz/address/0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4) |
| **PrincipalToken** | `0x721944D878eAF967031E4Ef1101142ccDD773cF4` | PT-wU2U token                 | [View](https://testnet.u2uscan.xyz/address/0x721944D878eAF967031E4Ef1101142ccDD773cF4) |
| **YieldToken**     | `0xBFE70173B901Bb927F2cD23BE63964f240216f78` | YT-wU2U token                 | [View](https://testnet.u2uscan.xyz/address/0xBFE70173B901Bb927F2cD23BE63964f240216f78) |
| **OrochiOracle**   | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | Price feed oracle | [View](https://testnet.u2uscan.xyz/address/0xe702013eA3045D265720337127f06a6cCab4Fd15) |
| **MockAMM**        | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | Trading pool (0.3% fee) | [View](https://testnet.u2uscan.xyz/address/0x5158337793D9913b5967B91a32bB328521D7C7fb) |

> For detailed network configurations, see [NETWORKS.md](NETWORKS.md)


## How it works

1. **Deposit U2U** and **wrap it to wU2U**
2. **Split wU2U** into **PT (principal) + YT (yield)**
3. **Trade PT/YT on the AMM** or hold for yield
4. **Redeem** anytime or wait for maturity


<table style="width:100%">
<tr>
<td style="width:35%; vertical-align:top; padding-right:10px;">

<pre>
   Your Asset (U2U)
          ↓
       [Wrap]
          ↓
Wrapped Asset (wU2U)
          ↓
      [Split]
          ↓
    ┌─────┴─────┐
    ↓           ↓
   PT           YT
  (95%)        (5%)
Principal     Yield
(PT-wU2U)   (YT-wU2U)
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
Deposit **1.0 wU2U** with **5% APY** and **1 year maturity**:

```
Input: 1.0 wU2U
     ↓
You receive:
   • 0.9524 PT (95.24%) - Principal
   • 0.0476 YT (4.76%) - Yield
     ↓
Total: 1.0 wU2U (balanced)
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
├── WrappedU2U.sol        # wU2U wrapper contract
├── MockAMM.sol           # AMM for PT/YT trading
└── OrochiOracle.sol      # Price oracle integration
```

### Frontend

```
📂 app/src/
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


## How to Use
For detailed setup, wallet connection, and usage instructions, please refer to our [Getting Started Guide](GETTING_STARTED.md).


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


<p align="center">Built with ❤️ for the VietBUIDL Hackathon</p>
