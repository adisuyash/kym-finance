# Changelog

## Version 1.0.0 - Base Sepolia Launch (October 1, 2025)

### 🎉 Major Release - Complete Migration to Base Sepolia

This release marks the complete migration of Kym Finance from U2U Nebulas Testnet to Base Sepolia Testnet.

### ✨ New Features

- **Base Sepolia Support**: Full integration with Base Sepolia testnet (Chain ID: 84532)
- **WETH Contract**: New Wrapped Ether contract replacing WrappedU2U
- **Unified Etherscan API**: Using Etherscan v2 API for multi-chain verification
- **Updated UI**: All interface elements now reflect ETH/WETH instead of U2U

### 🔄 Changes

#### Smart Contracts
- Created `WETH.sol` - Wrapped Ether contract
- Removed `WrappedU2U.sol` 
- All contracts deployed to Base Sepolia
- Contract addresses updated in configuration

#### Configuration
- Updated Hardhat config for Base Sepolia and Base Mainnet
- Simplified network configuration
- Removed all U2U network references
- Updated to Etherscan v2 unified API

#### Frontend
- All components updated: ETH → WETH → PT + YT flow
- Updated contract addresses for Base Sepolia deployment
- Fixed network detection and colors
- Updated TradingView widget to show ETH/USD
- All UI text updated from U2U to ETH/WETH

#### Documentation
- Completely rewritten README for Base Sepolia
- Updated GETTING_STARTED guide
- Created BASE_SEPOLIA.md deployment guide
- Updated all examples and tutorials
- Removed outdated U2U documentation

### 📦 Deployed Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| WETH | `0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4` |
| YieldSplitter | `0xe702013eA3045D265720337127f06a6cCab4Fd15` |
| PrincipalToken | `0x1179a143dA25679e9FE46b8FD5194B76d9d1AFfd` |
| YieldToken | `0xfbbA21359Ebd8940dF2CcDb032f2093aa41f56cb` |
| OrochiOracle | `0x5158337793D9913b5967B91a32bB328521D7C7fb` |
| MockAMM | `0x3742409450A9262d828Aaf47b422ef8693DA2eCc` |

### 🗑️ Removed

- All U2U Nebulas Testnet configurations
- WrappedU2U contract and tests
- U2U deployment scripts
- Outdated network documentation
- Legacy deployment addresses

### 🔧 Technical Details

- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Native Token**: ETH

### 📝 Migration Notes

This is a breaking change from the previous U2U deployment. All users need to:
1. Switch to Base Sepolia network
2. Get Base Sepolia ETH from the faucet
3. Use the new contract addresses
4. Update any integrations to use WETH instead of wU2U

### 🙏 Acknowledgments

Built for the VietBUIDL Hackathon and now deployed on Base Sepolia for wider accessibility.

---

## Previous Versions

### Version 0.2.0 - U2U Nebulas Testnet (September 30, 2025)
- Initial deployment on U2U Nebulas Testnet
- Core yield splitting functionality
- PT/YT trading on MockAMM
- Basic frontend interface
