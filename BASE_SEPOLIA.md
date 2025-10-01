# Kym Finance on Base Sepolia

## Network Information

- **Chain ID**: 84532
- **Network Name**: Base Sepolia Testnet
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Native Token**: ETH

## Deployed Contracts

All contracts are deployed and verified on Base Sepolia:

| Contract | Address | Purpose |
|----------|---------|---------|
| **WETH** | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` | Wrapped Ether (ETH → WETH) |
| **YieldSplitter** | `0xe702013eA3045D265720337127f06a6cCab4Fd15` | Core yield splitting logic |
| **PrincipalToken** | `0x1179a143dA25679e9FE46b8FD5194B76d9d1AFfd` | PT-WETH (Principal Token) |
| **YieldToken** | `0xfbbA21359Ebd8940dF2CcDb032f2093aa41f56cb` | YT-WETH (Yield Token) |
| **OrochiOracle** | `0x5158337793D9913b5967B91a32bB328521D7C7fb` | Price oracle |
| **MockAMM** | `0x3742409450A9262d828Aaf47b422ef8693DA2eCc` | Automated Market Maker |

**Deployment Date**: October 1, 2025

## Quick Start

### 1. Get Test ETH
Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) to get free test ETH.

### 2. Add Base Sepolia to MetaMask
- Network Name: Base Sepolia
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Currency Symbol: ETH
- Block Explorer: https://sepolia.basescan.org

### 3. Use Kym Finance
1. Visit [kymfinance.vercel.app](https://kymfinance.vercel.app)
2. Connect your wallet
3. Switch to Base Sepolia network
4. Start wrapping ETH and splitting yields!

## Development

### Deploy Contracts
```bash
cd packages/hardhat
npm run deploy
```

### Run Frontend
```bash
cd packages/app
npm run dev
```

### Environment Variables
Create a `.env` file:
```bash
DEPLOYER_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Contract Verification

All contracts are verified on Sourcify and can be verified on Basescan using:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

## Support

- **Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [BASE_SEPOLIA_DEPLOYMENT.md](packages/hardhat/BASE_SEPOLIA_DEPLOYMENT.md)
- **Discord**: [Base Discord](https://discord.gg/buildonbase)
- **Twitter**: [@KymFinance](https://x.com/KymFinance)

## License

MIT License - see [LICENSE](LICENSE) for details.
