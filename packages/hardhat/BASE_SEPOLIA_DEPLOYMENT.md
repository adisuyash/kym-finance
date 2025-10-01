# Base Sepolia Deployment Guide

This guide will help you deploy the Kym Finance contracts to Base Sepolia testnet.

## Prerequisites

1. **Get Base Sepolia ETH**
   - Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
   - You'll need at least 0.01 ETH for deployment

2. **Get an Etherscan API Key** (for contract verification)
   - Go to [Etherscan](https://etherscan.io/myapikey)
   - Create an account and generate an API key
   - Note: Etherscan's v2 API supports all EVM chains (Base, Arbitrum, Optimism, etc.) through a unified endpoint

3. **Set up Environment Variables**
   
   Create a `.env` file in the project root (if it doesn't exist) with:
   
   ```bash
   # Your deployer private key (without 0x prefix)
   DEPLOYER_KEY=your_private_key_here
   
   # Etherscan API key (works for Base, Arbitrum, Optimism, etc. via v2 API)
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   
   # Or set BASESCAN_API_KEY (same key works)
   BASESCAN_API_KEY=your_etherscan_api_key_here
   ```

   ⚠️ **IMPORTANT**: Never commit your `.env` file to version control!

## Network Configuration

The Base Sepolia network is already configured in `hardhat.config.ts`:

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH

## Deployment Steps

### 1. Compile Contracts

```bash
cd packages/hardhat
npm run build
```

### 2. Deploy to Base Sepolia

```bash
npm run deploy:base-sepolia
```

This will deploy:
- WrappedETH (wrapper for native ETH)
- YieldSplitter (with 5% APY, 1 year maturity)
- PrincipalToken (PT) - automatically deployed by YieldSplitter
- YieldToken (YT) - automatically deployed by YieldSplitter
- OrochiOracle (price oracle)
- MockAMM (automated market maker)

### 3. Save Contract Addresses

After deployment, addresses will be saved to `deployed-addresses-base-sepolia.json`. Keep this file for reference.

### 4. Verify Contracts on Basescan

The deployment script will output verification commands. Run them to verify your contracts:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

Example:
```bash
npx hardhat verify --network baseSepolia 0x123... 
npx hardhat verify --network baseSepolia 0x456... 0x123... 31536000 500
```

## Testing on Base Sepolia

1. **Add Base Sepolia to MetaMask**
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

2. **Update Frontend Configuration**
   
   Update your frontend with the deployed contract addresses from `deployed-addresses-base-sepolia.json`.

3. **Test User Flow**
   - Connect wallet to Base Sepolia
   - Wrap ETH to WrappedETH
   - Split tokens into PT and YT
   - Trade on the AMM
   - Redeem at maturity

## Troubleshooting

### "Insufficient funds" error
- Make sure you have enough Base Sepolia ETH
- Get more from the faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### "Invalid API Key" during verification
- Check that your `BASESCAN_API_KEY` or `ETHERSCAN_API_KEY` is set correctly in `.env`
- Verify the API key is valid on Basescan

### "Network not found" error
- Make sure you're in the correct directory: `packages/hardhat`
- Check that `hardhat.config.ts` includes the `baseSepolia` network configuration

### Gas estimation failed
- The Base Sepolia network might be congested
- Try again after a few minutes
- You can manually set gas price in the network config if needed

## Useful Links

- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Base Documentation**: https://docs.base.org
- **Base Discord**: https://discord.gg/buildonbase

## Next Steps

After successful deployment:

1. ✅ Verify all contracts on Basescan
2. ✅ Update frontend with new contract addresses
3. ✅ Test the complete user flow
4. ✅ Share your deployment on social media
5. ✅ Consider deploying to Base Mainnet when ready

## Support

If you encounter any issues:
- Check the [Base Discord](https://discord.gg/buildonbase) for support
- Review the [Hardhat documentation](https://hardhat.org/docs)
- Open an issue in the project repository
