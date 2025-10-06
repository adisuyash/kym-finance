# 🚀 Mainnet Quick Start Guide

## Contract Addresses (U2U Solaris Mainnet)

Copy these addresses for quick reference:

```typescript
// Chain ID: 39
const MAINNET_CONTRACTS = {
  wrappedU2U: '0x7075D321d3f586445609635763eF9Dbbc6B13127',
  yieldSplitter: '0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe',
  principalToken: '0x6F363E95B26d92Ffb550e968A1a134efeb4029FE',
  yieldToken: '0xfF2fb46282e801a96730B39634454876AE54173a',
  orochiOracle: '0x8c2786cfc456232a4017658481C71a3FF3676418',
  mockAMM: '0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946',
}
```

## 🔗 Useful Links

- **Explorer**: https://u2uscan.xyz/
- **RPC**: https://rpc-mainnet.u2u.xyz/
- **Deployer**: 0x73A4ecaBFb474063ab5585f72113E543E42c7201

## ✅ What's Integrated

The frontend automatically:
- ✅ Detects U2U Mainnet (Chain ID: 39)
- ✅ Loads mainnet contract addresses
- ✅ Supports switching between mainnet/testnet
- ✅ Uses correct ABIs for all contracts

## 🎯 User Flow

1. User connects wallet
2. If not on U2U network → Shows network switcher
3. User clicks "Switch to U2U Mainnet"
4. App loads mainnet contracts
5. User can interact with all features

## 🧪 Testing Checklist

- [ ] Connect wallet to mainnet
- [ ] Wrap U2U tokens
- [ ] Deposit and split yield
- [ ] Check PT/YT balances
- [ ] Swap PT ↔ YT on AMM
- [ ] Claim yield
- [ ] Redeem tokens

## 📱 Network Switching

Users can switch networks via:
1. **Wallet UI** - Standard network switcher
2. **App UI** - Network guard shows switch buttons
3. **AppKit Modal** - Built-in network selector

## 🔍 Verify Deployment

Check any contract on U2Uscan:
```
https://u2uscan.xyz/address/0x7075D321d3f586445609635763eF9Dbbc6B13127
```

## 💡 Development Tips

### Get Contract Addresses in Code
```typescript
import { getContractAddresses } from '@/config/contracts'

// Automatically returns correct addresses based on connected chain
const addresses = getContractAddresses(chainId)
```

### Check Current Network
```typescript
import { useChainId } from 'wagmi'

const chainId = useChainId()
// 39 = Mainnet, 2484 = Testnet
```

### Switch Network Programmatically
```typescript
import { useSwitchChain } from 'wagmi'

const { switchChain } = useSwitchChain()
switchChain?.({ chainId: 39 }) // Switch to mainnet
```

## 🎉 Ready to Go!

Everything is configured and ready for mainnet usage. Just connect your wallet and start using Kym Finance on U2U Solaris Mainnet!
