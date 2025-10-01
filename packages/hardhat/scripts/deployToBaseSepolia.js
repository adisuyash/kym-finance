const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Kym Finance to Base Sepolia Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  Low balance! You might need more ETH for deployment");
  }

  console.log("\n📋 Deployment Plan:");
  console.log("1. WrappedU2U (as WrappedETH for Base)");
  console.log("2. YieldSplitter (auto-deploys PT and YT)");
  console.log("3. OrochiOracle");
  console.log("4. MockAMM");

  // 1. Deploy WrappedU2U (using as WrappedETH on Base)
  console.log("\n💎 Step 1: Deploying WrappedETH...");
  const WrappedU2U = await ethers.getContractFactory("WrappedU2U");
  const wrappedETH = await WrappedU2U.deploy();
  await wrappedETH.waitForDeployment();
  const wrappedETHAddress = await wrappedETH.getAddress();
  console.log("✅ WrappedETH deployed to:", wrappedETHAddress);

  // 2. Deploy YieldSplitter (1 year maturity)
  console.log("\n✂️ Step 2: Deploying YieldSplitter...");
  const maturityDuration = 365 * 24 * 60 * 60; // 1 year
  const yieldPercentage = 500; // 5% APY in basis points
  const YieldSplitter = await ethers.getContractFactory("YieldSplitter");
  const yieldSplitter = await YieldSplitter.deploy(wrappedETHAddress, maturityDuration, yieldPercentage);
  await yieldSplitter.waitForDeployment();
  const yieldSplitterAddress = await yieldSplitter.getAddress();
  console.log("✅ YieldSplitter deployed to:", yieldSplitterAddress);
  console.log("📊 Yield Percentage: 5% APY");

  // Get PT and YT addresses
  const ptAddress = await yieldSplitter.principalToken();
  const ytAddress = await yieldSplitter.yieldToken();
  console.log("📍 PrincipalToken deployed to:", ptAddress);
  console.log("📍 YieldToken deployed to:", ytAddress);

  // 3. Deploy OrochiOracle
  console.log("\n📊 Step 3: Deploying OrochiOracle...");
  const Oracle = await ethers.getContractFactory("OrochiOracle");
  const orochiOracle = await Oracle.deploy();
  await orochiOracle.waitForDeployment();
  const OracleAddress = await orochiOracle.getAddress();
  console.log("✅ OrochiOracle deployed to:", OracleAddress);

  // 4. Deploy MockAMM
  console.log("\n🏊 Step 4: Deploying MockAMM...");
  const MockAMM = await ethers.getContractFactory("MockAMM");
  const mockAMM = await MockAMM.deploy(ptAddress, ytAddress);
  await mockAMM.waitForDeployment();
  const mockAMMAddress = await mockAMM.getAddress();
  console.log("✅ MockAMM deployed to:", mockAMMAddress);

  console.log("\n🎉 Deployment Complete!");
  console.log("\n📋 Contract Addresses Summary:");
  console.log("=====================================");
  console.log(`WrappedETH:      ${wrappedETHAddress}`);
  console.log(`YieldSplitter:   ${yieldSplitterAddress}`);
  console.log(`PrincipalToken:  ${ptAddress}`);
  console.log(`YieldToken:      ${ytAddress}`);
  console.log(`Oracle:          ${OracleAddress}`);
  console.log(`MockAMM:         ${mockAMMAddress}`);
  console.log("=====================================");

  console.log("\n🔗 Base Sepolia Testnet Info:");
  console.log("Chain ID: 84532");
  console.log("RPC: https://sepolia.base.org");
  console.log("Explorer: https://sepolia.basescan.org/");
  console.log("Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");

  console.log("\n📝 Frontend Configuration:");
  console.log("Update these addresses in your frontend components:");
  console.log(`const WRAPPED_ETH_ADDRESS = '${wrappedETHAddress}' as const`);
  console.log(`const YIELD_SPLITTER_ADDRESS = '${yieldSplitterAddress}' as const`);
  console.log(`const PRINCIPAL_TOKEN_ADDRESS = '${ptAddress}' as const`);
  console.log(`const YIELD_TOKEN_ADDRESS = '${ytAddress}' as const`);
  console.log(`const OROCHI_ORACLE_ADDRESS = '${OracleAddress}' as const`);
  console.log(`const MOCK_AMM_ADDRESS = '${mockAMMAddress}' as const`);

  console.log("\n🚀 Next Steps:");
  console.log("1. Verify contracts on Basescan:");
  console.log(`   npx hardhat verify --network baseSepolia ${wrappedETHAddress}`);
  console.log(`   npx hardhat verify --network baseSepolia ${yieldSplitterAddress} ${wrappedETHAddress} ${maturityDuration} ${yieldPercentage}`);
  console.log(`   npx hardhat verify --network baseSepolia ${OracleAddress}`);
  console.log(`   npx hardhat verify --network baseSepolia ${mockAMMAddress} ${ptAddress} ${ytAddress}`);
  console.log("2. Update contract addresses in frontend components");
  console.log("3. Test the full user flow on Base Sepolia");

  // Save addresses to a file for easy reference
  const addresses = {
    network: "baseSepolia",
    chainId: 84532,
    wrappedETH: wrappedETHAddress,
    yieldSplitter: yieldSplitterAddress,
    principalToken: ptAddress,
    yieldToken: ytAddress,
    orochiOracle: OracleAddress,
    mockAMM: mockAMMAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  const fs = require('fs');
  const filename = 'deployed-addresses-base-sepolia.json';
  fs.writeFileSync(filename, JSON.stringify(addresses, null, 2));
  console.log(`\n💾 Addresses saved to ${filename}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
