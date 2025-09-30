# Kym Finance - U2U Nebulas Testnet Deployment

**Deployment Date:** 2025-09-30T12:54:40.271Z  
**Network:** U2U Nebulas Testnet  
**Chain ID:** 2484  
**Deployer:** 0x225d5a1079121faD050a33bDf1373bAf71aa4219

## Network Configuration

- **RPC URL:** https://rpc-nebulas-testnet.u2u.xyz/
- **Explorer:** https://testnet.u2uscan.xyz/
- **Faucet:** https://faucet.u2u.xyz/

## Deployed Contract Addresses

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| **WrappedU2U** | `0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43` | [View](https://testnet.u2uscan.xyz/address/0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43) |
| **YieldSplitter** | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | [View](https://testnet.u2uscan.xyz/address/0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4) |
| **PrincipalToken (PT)** | `0x721944D878eAF967031E4Ef1101142ccDD773cF4` | [View](https://testnet.u2uscan.xyz/address/0x721944D878eAF967031E4Ef1101142ccDD773cF4) |
| **YieldToken (YT)** | `0xBFE70173B901Bb927F2cD23BE63964f240216f78` | [View](https://testnet.u2uscan.xyz/address/0xBFE70173B901Bb927F2cD23BE63964f240216f78) |
| **OrochiOracle** | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | [View](https://testnet.u2uscan.xyz/address/0xe702013eA3045D265720337127f06a6cCab4Fd15) |
| **MockAMM** | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | [View](https://testnet.u2uscan.xyz/address/0x5158337793D9913b5967B91a32bB328521D7C7fb) |

## Contract Details

### YieldSplitter Configuration
- **Maturity Duration:** 365 days (1 year)
- **Yield Percentage:** 5% APY (500 basis points)
- **Underlying Asset:** WrappedU2U (wU2U)

### Token Relationships
- **PrincipalToken (PT):** Auto-deployed by YieldSplitter
- **YieldToken (YT):** Auto-deployed by YieldSplitter
- **MockAMM:** Enables PT ↔ YT swaps with 0.3% fee

## Frontend Integration

The contract addresses have been automatically updated in:
- `packages/app/src/config/contracts.ts`

The frontend will automatically use these addresses when connected to U2U Nebulas Testnet (Chain ID: 2484).

## ABIs Location

Contract ABIs are available in:
- **Minimal ABIs:** `packages/app/src/config/contracts.ts` (used by frontend)
- **Full ABIs:** `packages/hardhat/artifacts/contracts/*/[ContractName].json`
- **TypeChain Types:** `packages/hardhat/typechain-types/`

## Verification Status

Contracts can be verified on U2U Scan using:
```bash
cd packages/hardhat
npx hardhat verify --network u2uTestnet <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

Note: U2U Scan doesn't require an API key for verification.

## Next Steps

1. ✅ Contracts deployed successfully
2. ✅ Frontend addresses updated
3. 🔄 Optional: Run setup demo script to populate test data
   ```bash
   cd packages/hardhat
   npx hardhat run scripts/setupDemo.js --network u2uTestnet
   ```
4. 🔄 Test the full user flow on the frontend
5. 🔄 Verify contracts on U2U Scan (optional)
