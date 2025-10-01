# Quick Reference - Kym Finance on ETH Testnet

## 🚀 Deployed Contracts (ETH Nebulas Testnet)

```
WrappedETH:      0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43
YieldSplitter:   0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4
PrincipalToken:  0x721944D878eAF967031E4Ef1101142ccDD773cF4
YieldToken:      0xBFE70173B901Bb927F2cD23BE63964f240216f78
OrochiOracle:    0xe702013eA3045D265720337127f06a6cCab4Fd15
MockAMM:         0x5158337793D9913b5967B91a32bB328521D7C7fb
```

## 🌐 Network Info

- **Chain ID:** 84532
- **RPC:** https://rpc-nebulas-testnet.eth.xyz/
- **Explorer:** https://testnet.ethscan.xyz/
- **Faucet:** https://faucet.eth.xyz/

## 📝 Frontend Integration

**Addresses updated in:** `packages/app/src/config/contracts.ts`

The frontend automatically uses these addresses when connected to Chain ID 84532.

## 🧪 Test the App

```bash
# Start frontend
cd packages/app
yarn dev

# Optional: Populate test data
cd packages/hardhat
npx hardhat run scripts/setupDemo.js --network ethTestnet
```

## 🔗 Explorer Links

- [WrappedETH](https://testnet.ethscan.xyz/address/0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43)
- [YieldSplitter](https://testnet.ethscan.xyz/address/0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4)
- [PrincipalToken](https://testnet.ethscan.xyz/address/0x721944D878eAF967031E4Ef1101142ccDD773cF4)
- [YieldToken](https://testnet.ethscan.xyz/address/0xBFE70173B901Bb927F2cD23BE63964f240216f78)
- [OrochiOracle](https://testnet.ethscan.xyz/address/0xe702013eA3045D265720337127f06a6cCab4Fd15)
- [MockAMM](https://testnet.ethscan.xyz/address/0x5158337793D9913b5967B91a32bB328521D7C7fb)

## ✅ Status

- ✅ All contracts deployed
- ✅ Frontend addresses updated
- ✅ ABIs available
- ✅ Network config verified
- ✅ All contracts verified!
- ✅ Ready to test!
