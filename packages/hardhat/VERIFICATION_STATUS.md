# Contract Verification Status - U2U Solaris Mainnet

**Last Updated:** 2025-10-06  
**Network:** U2U Solaris Mainnet (Chain ID: 39)  
**Status:** ALL CONTRACTS VERIFIED

---

## Verified Contracts

All 6 contracts have been successfully verified on U2U Scan and are publicly viewable with their source code.

### 1. WrappedU2U
- **Address:** `0x7075D321d3f586445609635763eF9Dbbc6B13127`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0x7075D321d3f586445609635763eF9Dbbc6B13127#code)
- **Constructor Args:** None

### 2. YieldSplitter
- **Address:** `0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe#code)
- **Constructor Args:**
  - `_wrappedU2U`: `0x7075D321d3f586445609635763eF9Dbbc6B13127`
  - `_maturityDuration`: `31536000` (365 days)
  - `_yieldPercentage`: `500` (5% APY)

### 3. PrincipalToken (PT-wU2U)
- **Address:** `0x6F363E95B26d92Ffb550e968A1a134efeb4029FE`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0x6F363E95B26d92Ffb550e968A1a134efeb4029FE#code)
- **Constructor Args:**
  - `name`: "Principal Token wU2U"
  - `symbol`: "PT-wU2U"
  - `_underlyingAsset`: `0x7075D321d3f586445609635763eF9Dbbc6B13127`
  - `_maturity`: Calculated timestamp (deployment + 365 days)

### 4. YieldToken (YT-wU2U)
- **Address:** `0xfF2fb46282e801a96730B39634454876AE54173a`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0xfF2fb46282e801a96730B39634454876AE54173a#code)
- **Constructor Args:**
  - `name`: "Yield Token wU2U"
  - `symbol`: "YT-wU2U"
  - `_underlyingAsset`: `0x7075D321d3f586445609635763eF9Dbbc6B13127`
  - `_maturity`: Calculated timestamp (deployment + 365 days)

### 5. OrochiOracle
- **Address:** `0x8c2786cfc456232a4017658481C71a3FF3676418`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0x8c2786cfc456232a4017658481C71a3FF3676418#code)
- **Constructor Args:** None

### 6. MockAMM
- **Address:** `0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946`
- **Status:** Verified
- **View Source:** [U2U Scan](https://u2uscan.xyz/address/0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946#code)
- **Constructor Args:**
  - `_token0`: `0x6F363E95B26d92Ffb550e968A1a134efeb4029FE` (PrincipalToken)
  - `_token1`: `0xfF2fb46282e801a96730B39634454876AE54173a` (YieldToken)

---

## Verification Summary

| Metric | Value |
|--------|-------|
| Total Contracts | 6 |
| Verified | 6 ✅ |
| Failed | 0 |
| Success Rate | 100% |

---

## How to Verify

To verify all contracts automatically:

```bash
cd packages/hardhat
npx hardhat run scripts/verifyMainnetContracts.js --network u2uMainnet
```

To verify individual contracts:

```bash
npx hardhat verify --network u2uMainnet <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

---

## Notes

- U2U Scan verification does not require an API key
- Sourcify verification is not supported for Chain ID 39 (this is expected)
- All contracts use Solidity 0.8.17 with optimizer enabled (200 runs)
- Verification includes all imported dependencies (OpenZeppelin contracts)

---

## Deployment Information

- **Deployment Date:** 2025-10-06T04:26:52.654Z
- **Deployer Address:** 0x73A4ecaBFb474063ab5585f72113E543E42c7201
- **Network:** U2U Solaris Mainnet
- **Chain ID:** 39
- **RPC URL:** https://rpc-mainnet.u2u.xyz
- **Explorer:** https://u2uscan.xyz/
