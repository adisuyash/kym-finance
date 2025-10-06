const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Kym Finance to U2U Solaris Mainnet...");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "U2U");

  if (balance < ethers.parseEther("1.0")) {
    console.warn("⚠️  Low balance! You might need more U2U for deployment");
    console.warn("⚠️  Recommended: At least 1 U2U for mainnet deployment");
  }

  console.log("\n📋 Deployment Plan:");
  console.log("1. WrappedU2U");
  console.log("2. YieldSplitter (auto-deploys PT and YT)");
  console.log("3. OrochiOracle");
  console.log("4. MockAMM");

  // 1. Deploy WrappedU2U
  console.log("\n💎 Step 1: Deploying WrappedU2U...");
  const WrappedU2U = await ethers.getContractFactory("WrappedU2U");
  const wrappedU2U = await WrappedU2U.deploy();
  await wrappedU2U.waitForDeployment();
  const wrappedU2UAddress = await wrappedU2U.getAddress();
  console.log("✅ WrappedU2U deployed to:", wrappedU2UAddress);

  // 2. Deploy YieldSplitter (1 year maturity)
  console.log("\n✂️ Step 2: Deploying YieldSplitter...");
  const maturityDuration = 365 * 24 * 60 * 60; // 1 year
  const yieldPercentage = 500; // 5% APY in basis points
  const YieldSplitter = await ethers.getContractFactory("YieldSplitter");
  const yieldSplitter = await YieldSplitter.deploy(wrappedU2UAddress, maturityDuration, yieldPercentage);
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
  console.log(`WrappedU2U:      ${wrappedU2UAddress}`);
  console.log(`YieldSplitter:   ${yieldSplitterAddress}`);
  console.log(`PrincipalToken:  ${ptAddress}`);
  console.log(`YieldToken:      ${ytAddress}`);
  console.log(`Oracle:          ${OracleAddress}`);
  console.log(`MockAMM:         ${mockAMMAddress}`);
  console.log("=====================================");

  console.log("\n🔗 U2U Solaris Mainnet Info:");
  console.log("Chain ID: 39");
  console.log("RPC: https://rpc-mainnet.u2u.xyz/");
  console.log("Explorer: https://u2uscan.xyz/");

  console.log("\n📝 Frontend Configuration:");
  console.log("Update these addresses in your frontend components:");
  console.log(`const WRAPPED_U2U_ADDRESS = '${wrappedU2UAddress}' as const`);
  console.log(`const YIELD_SPLITTER_ADDRESS = '${yieldSplitterAddress}' as const`);
  console.log(`const PRINCIPAL_TOKEN_ADDRESS = '${ptAddress}' as const`);
  console.log(`const YIELD_TOKEN_ADDRESS = '${ytAddress}' as const`);
  console.log(`const OROCHI_ORACLE_ADDRESS = '${OracleAddress}' as const`);
  console.log(`const MOCK_AMM_ADDRESS = '${mockAMMAddress}' as const`);

  console.log("\n🚀 Next Steps:");
  console.log("1. Verify contracts on U2Uscan");
  console.log("2. Update contract addresses in frontend components");
  console.log("3. Test the full user flow on mainnet");
  console.log("4. Monitor contract interactions");

  // Save addresses to a file for easy reference
  const addresses = {
    network: "u2uMainnet",
    chainId: 39,
    wrappedU2U: wrappedU2UAddress,
    yieldSplitter: yieldSplitterAddress,
    principalToken: ptAddress,
    yieldToken: ytAddress,
    orochiOracle: OracleAddress,
    mockAMM: mockAMMAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync('deployed-addresses-mainnet.json', JSON.stringify(addresses, null, 2));
  console.log("\n💾 Addresses saved to deployed-addresses-mainnet.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
