# Kym Finance - U2U Nebulas Testnet Deployment

**Deployment Date:** 2025-09-30T12:54:40.271Z  
**Network:** U2U Nebulas Testnet  
**Chain ID:** 2484  
**Deployer:** 0x225d5a1079121faD050a33bDf1373bAf71aa4219

## Network Configuration

### U2U Solaris Mainnet

- **RPC URL:** https://rpc-solaris-mainnet.u2u.xyz/
- **Explorer:** https://u2uscan.xyz/

### U2U Nebulas Testnet

- **RPC URL:** https://rpc-nebulas-testnet.u2u.xyz/
- **Explorer:** https://testnet.u2uscan.xyz/
- **Faucet:** https://faucet.u2u.xyz/

## Deployed Contract Addresses on Mainnet

| Contract                | Address                                      | Explorer Link                                                                  |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| **WrappedU2U**          | `0x7075D321d3f586445609635763eF9Dbbc6B13127` | [View](https://u2uscan.xyz/address/0x7075D321d3f586445609635763eF9Dbbc6B13127) |
| **YieldSplitter**       | `0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe` | [View](https://u2uscan.xyz/address/0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe) |
| **PrincipalToken (PT)** | `0x6F363E95B26d92Ffb550e968A1a134efeb4029FE` | [View](https://u2uscan.xyz/address/0x6F363E95B26d92Ffb550e968A1a134efeb4029FE) |
| **YieldToken (YT)**     | `0xfF2fb46282e801a96730B39634454876AE54173a` | [View](https://u2uscan.xyz/address/0xfF2fb46282e801a96730B39634454876AE54173a) |
| **OrochiOracle**        | `0x8c2786cfc456232a4017658481C71a3FF3676418` | [View](https://u2uscan.xyz/address/0x8c2786cfc456232a4017658481C71a3FF3676418) |
| **MockAMM**             | `0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946` | [View](https://u2uscan.xyz/address/0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946) |

## Deployed Contract Addresses on Testnet

| Contract                | Address                                      | Explorer Link                                                                          |
| ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| **WrappedU2U**          | `0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43` | [View](https://testnet.u2uscan.xyz/address/0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43) |
| **YieldSplitter**       | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | [View](https://testnet.u2uscan.xyz/address/0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4) |
| **PrincipalToken (PT)** | `0x721944D878eAF967031E4Ef1101142ccDD773cF4` | [View](https://testnet.u2uscan.xyz/address/0x721944D878eAF967031E4Ef1101142ccDD773cF4) |
| **YieldToken (YT)**     | `0xBFE70173B901Bb927F2cD23BE63964f240216f78` | [View](https://testnet.u2uscan.xyz/address/0xBFE70173B901Bb927F2cD23BE63964f240216f78) |
| **OrochiOracle**        | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | [View](https://testnet.u2uscan.xyz/address/0xe702013eA3045D265720337127f06a6cCab4Fd15) |
| **MockAMM**             | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | [View](https://testnet.u2uscan.xyz/address/0x5158337793D9913b5967B91a32bB328521D7C7fb) |

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

### Mainnet Contracts - ALL VERIFIED

All mainnet contracts have been successfully verified on U2U Scan:

| Contract       | Status   | Verification Link                                                                        |
| -------------- | -------- | ---------------------------------------------------------------------------------------- |
| WrappedU2U     | Verified | [View Code](https://u2uscan.xyz/address/0x7075D321d3f586445609635763eF9Dbbc6B13127#code) |
| YieldSplitter  | Verified | [View Code](https://u2uscan.xyz/address/0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe#code) |
| PrincipalToken | Verified | [View Code](https://u2uscan.xyz/address/0x6F363E95B26d92Ffb550e968A1a134efeb4029FE#code) |
| YieldToken     | Verified | [View Code](https://u2uscan.xyz/address/0xfF2fb46282e801a96730B39634454876AE54173a#code) |
| OrochiOracle   | Verified | [View Code](https://u2uscan.xyz/address/0x8c2786cfc456232a4017658481C71a3FF3676418#code) |
| MockAMM        | Verified | [View Code](https://u2uscan.xyz/address/0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946#code) |

### Verify Contracts Manually

To verify contracts on U2U Scan:

```bash
cd packages/hardhat

# Verify all mainnet contracts at once
npx hardhat run scripts/verifyMainnetContracts.js --network u2uMainnet

# Or verify individual contracts
npx hardhat verify --network u2uMainnet <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

Note: U2U Scan doesn't require an API key for verification.

## Next Steps

1. ✅ Contracts deployed successfully to mainnet
2. ✅ All contracts verified on U2U Scan
3. ✅ Frontend addresses updated
4. 🔄 Optional: Run setup demo script to populate test data
   ```bash
   cd packages/hardhat
   npx hardhat run scripts/setupPoolDemo.js --network u2uMainnet
   ```
5. 🔄 Test the full user flow on the frontend
6. 🔄 Monitor contract interactions and user activity
