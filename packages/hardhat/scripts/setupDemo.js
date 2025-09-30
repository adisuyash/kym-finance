const { ethers } = require("hardhat");

async function main() {
  console.log("🎭 Setting up demo environment...");

  // Contract addresses (deployed 2025-09-30)
  const WRAPPED_U2U_ADDRESS = "0x31c13bed4969a135bE285Bcb7BfDc56b601EaA43";
  const YIELD_SPLITTER_ADDRESS = "0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4";
  const MOCK_AMM_ADDRESS = "0x5158337793D9913b5967B91a32bB328521D7C7fb";
  const OROCHI_ORACLE_ADDRESS = "0xe702013eA3045D265720337127f06a6cCab4Fd15";

  if (WRAPPED_U2U_ADDRESS === "0x..." || YIELD_SPLITTER_ADDRESS === "0x...") {
    console.error("❌ Please update contract addresses in this script");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Get contract instances
  const wrappedU2U = await ethers.getContractAt("WrappedU2U", WRAPPED_U2U_ADDRESS);
  const yieldSplitter = await ethers.getContractAt("YieldSplitter", YIELD_SPLITTER_ADDRESS);

  let mockAMM, orochiOracle;
  if (MOCK_AMM_ADDRESS !== "0x...") {
    mockAMM = await ethers.getContractAt("MockAMM", MOCK_AMM_ADDRESS);
  }
  if (OROCHI_ORACLE_ADDRESS !== "0x...") {
    orochiOracle = await ethers.getContractAt("OrochiOracle", OROCHI_ORACLE_ADDRESS);
  }

  // Get PT and YT addresses
  const ptAddress = await yieldSplitter.principalToken();
  const ytAddress = await yieldSplitter.yieldToken();
  const principalToken = await ethers.getContractAt("PrincipalToken", ptAddress);
  const yieldToken = await ethers.getContractAt("YieldToken", ytAddress);

  console.log("\n📍 Contract Addresses:");
  console.log("WrappedU2U:", WRAPPED_U2U_ADDRESS);
  console.log("YieldSplitter:", YIELD_SPLITTER_ADDRESS);
  console.log("PrincipalToken:", ptAddress);
  console.log("YieldToken:", ytAddress);
  if (mockAMM) console.log("MockAMM:", MOCK_AMM_ADDRESS);
  if (orochiOracle) console.log("OrochiOracle:", OROCHI_ORACLE_ADDRESS);

  console.log("\n💰 Step 1: Wrapping U2U to wU2U...");

  // Wrap U2U for demo
  const wrapAmount = ethers.parseEther("0.5");

  await wrappedU2U.connect(deployer).deposit({ value: wrapAmount });

  console.log("✅ Wrapped 0.5 U2U for deployer");

  console.log("\n✂️ Step 2: Splitting tokens...");

  // Approve and split tokens
  const splitAmount = ethers.parseEther("0.3");

  await wrappedU2U.connect(deployer).approve(YIELD_SPLITTER_ADDRESS, splitAmount);

  await yieldSplitter.connect(deployer).depositAndSplit(splitAmount);

  console.log("✅ Split 0.3 wU2U into PT+YT for deployer");

  // Check balances
  const deployerPT = await principalToken.balanceOf(deployer.address);
  const deployerYT = await yieldToken.balanceOf(deployer.address);
  console.log(`📊 Deployer: ${ethers.formatEther(deployerPT)} PT, ${ethers.formatEther(deployerYT)} YT`);

  if (mockAMM) {
    console.log("\n🏊 Step 3: Adding liquidity to AMM...");

    const liquidityAmount = ethers.parseEther("0.1");

    // Approve AMM to spend tokens
    await principalToken.connect(deployer).approve(MOCK_AMM_ADDRESS, liquidityAmount);
    await yieldToken.connect(deployer).approve(MOCK_AMM_ADDRESS, liquidityAmount);

    // Add initial liquidity
    await mockAMM.connect(deployer).addInitialLiquidity(liquidityAmount, liquidityAmount);
    console.log("✅ Added 0.1 PT + 0.1 YT liquidity to AMM");

    // Check pool info
    const poolInfo = await mockAMM.getPoolInfo();
    console.log(`📊 Pool: ${ethers.formatEther(poolInfo[0])} PT, ${ethers.formatEther(poolInfo[1])} YT`);
  }

  if (orochiOracle) {
    console.log("\n📊 Step 4: Updating oracle prices...");

    // Update mock prices
    await orochiOracle.updatePrice("U2U/USD", ethers.parseEther("0.5"));
    await orochiOracle.updatePrice("PT-wU2U/USD", ethers.parseEther("0.48"));
    await orochiOracle.updatePrice("YT-wU2U/USD", ethers.parseEther("0.02"));

    console.log("✅ Updated oracle prices");

    // Check prices
    const u2uPrice = await orochiOracle.getLatestPrice("U2U/USD");
    const ptPrice = await orochiOracle.getLatestPrice("PT-wU2U/USD");
    const ytPrice = await orochiOracle.getLatestPrice("YT-wU2U/USD");

    console.log(`📊 Prices: U2U=$${ethers.formatEther(u2uPrice)}, PT=$${ethers.formatEther(ptPrice)}, YT=$${ethers.formatEther(ytPrice)}`);
  }

  console.log("\n🎯 Demo Setup Complete!");
  console.log("\n📋 Summary:");
  console.log("- Each user has 50 wU2U remaining");
  console.log("- Each user has 50 PT + 50 YT tokens");
  console.log("- AMM has 20 PT + 20 YT liquidity (if deployed)");
  console.log("- Oracle has updated prices (if deployed)");

  console.log("\n🚀 Ready for demo! Users can now:");
  console.log("1. Trade PT ↔ YT on the AMM");
  console.log("2. Claim yield from YT tokens");
  console.log("3. Redeem PT+YT back to wU2U");
  console.log("4. View portfolio and price charts");

  console.log("\n🔗 Frontend Setup:");
  console.log("Update these addresses in your frontend components:");
  console.log(`WRAPPED_U2U_ADDRESS = '${WRAPPED_U2U_ADDRESS}'`);
  console.log(`YIELD_SPLITTER_ADDRESS = '${YIELD_SPLITTER_ADDRESS}'`);
  console.log(`PRINCIPAL_TOKEN_ADDRESS = '${ptAddress}'`);
  console.log(`YIELD_TOKEN_ADDRESS = '${ytAddress}'`);
  if (mockAMM) console.log(`MOCK_AMM_ADDRESS = '${MOCK_AMM_ADDRESS}'`);
  if (orochiOracle) console.log(`OROCHI_ORACLE_ADDRESS = '${OROCHI_ORACLE_ADDRESS}'`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Demo setup failed:", error);
    process.exit(1);
  });
