const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Setting up AMM Pool Demo...");

  // New contract addresses
  // const WRAPPED_U2U_ADDRESS = "0xF7Bce9D2106773D8d14B17B49FC261EfF52e7d0D";
  // const YIELD_SPLITTER_ADDRESS = "0x81485FBD886d262b671F1789FB066366619eA8c7";
  // const MOCK_AMM_ADDRESS = "0x3aE2a95a17aEdb8B53d0EBa6715336274b098DbF";
  
  const WRAPPED_U2U_ADDRESS = "0x7075D321d3f586445609635763eF9Dbbc6B13127";
  const YIELD_SPLITTER_ADDRESS = "0xbDD418Ea726a0b53662E42429BDAB867Ac746aAe";
  const MOCK_AMM_ADDRESS = "0xAB3ca7a72A9a26DB78A3d0Ed81C730085E23a946";

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Get contract instances
  const wrappedU2U = await ethers.getContractAt("WrappedU2U", WRAPPED_U2U_ADDRESS);
  const yieldSplitter = await ethers.getContractAt("YieldSplitter", YIELD_SPLITTER_ADDRESS);
  const mockAMM = await ethers.getContractAt("MockAMM", MOCK_AMM_ADDRESS);
  
  // Get PT and YT addresses
  const ptAddress = await yieldSplitter.principalToken();
  const ytAddress = await yieldSplitter.yieldToken();
  const principalToken = await ethers.getContractAt("PrincipalToken", ptAddress);
  const yieldToken = await ethers.getContractAt("YieldToken", ytAddress);

  console.log("📍 PT Address:", ptAddress);
  console.log("📍 YT Address:", ytAddress);

  // Step 1: Wrap some U2U
  console.log("\n💰 Step 1: Wrapping 5 U2U...");
  const wrapAmount = ethers.parseEther("5");
  await wrappedU2U.deposit({ value: wrapAmount });
  
  const wU2UBalance = await wrappedU2U.balanceOf(deployer.address);
  console.log(`✅ Wrapped U2U Balance: ${ethers.formatEther(wU2UBalance)}`);

  // Step 2: Split wU2U to get PT/YT tokens
  console.log("\n✂️ Step 2: Splitting 4 wU2U to get PT/YT tokens...");
  const splitAmount = ethers.parseEther("4");
  
  console.log("📋 Approving wU2U...");
  const approveTx = await wrappedU2U.approve(YIELD_SPLITTER_ADDRESS, splitAmount);
  await approveTx.wait();
  
  console.log("📋 Splitting wU2U...");
  const splitTx = await yieldSplitter.depositAndSplit(splitAmount);
  await splitTx.wait();
  
  const ptBalance = await principalToken.balanceOf(deployer.address);
  const ytBalance = await yieldToken.balanceOf(deployer.address);
  
  console.log(`✅ PT Balance: ${ethers.formatEther(ptBalance)}`);
  console.log(`✅ YT Balance: ${ethers.formatEther(ytBalance)}`);

  // Step 3: Initialize AMM Pool
  console.log("\n🏊 Step 3: Initializing AMM Pool...");
  
  // Use smaller amounts for initial liquidity
  const initPTAmount = ptBalance / 2n; // Use half of PT balance
  const initYTAmount = ytBalance / 2n; // Use half of YT balance
  
  console.log(`📊 Initializing with ${ethers.formatEther(initPTAmount)} PT and ${ethers.formatEther(initYTAmount)} YT`);
  
  // Approve tokens for AMM
  console.log("📋 Approving PT tokens...");
  const approvePTTx = await principalToken.approve(MOCK_AMM_ADDRESS, initPTAmount);
  await approvePTTx.wait();
  
  console.log("📋 Approving YT tokens...");
  const approveYTTx = await yieldToken.approve(MOCK_AMM_ADDRESS, initYTAmount);
  await approveYTTx.wait();
  
  // Initialize the pool
  console.log("📋 Adding initial liquidity...");
  const initTx = await mockAMM.addInitialLiquidity(initPTAmount, initYTAmount);
  await initTx.wait();
  
  console.log("✅ AMM Pool initialized successfully!");

  // Step 4: Check pool status
  console.log("\n📊 Step 4: Checking pool status...");
  const poolInfo = await mockAMM.getPoolInfo();
  console.log(`📊 PT Reserve: ${ethers.formatEther(poolInfo[0])}`);
  console.log(`📊 YT Reserve: ${ethers.formatEther(poolInfo[1])}`);
  console.log(`📊 Exchange Rate: ${ethers.formatEther(poolInfo[2])}`);
  console.log(`📊 Pool Initialized: ${poolInfo[3]}`);

  // Step 5: Pool is ready for trading!
  console.log("\n🎯 Step 5: Pool ready for trading!");

  console.log("\n🎉 AMM Pool Demo Setup Complete!");
  console.log("\n📋 Summary:");
  console.log("=====================================");
  console.log(`✅ Pool Initialized: ${poolInfo[3]}`);
  console.log(`✅ PT Reserve: ${ethers.formatEther(poolInfo[0])} tokens`);
  console.log(`✅ YT Reserve: ${ethers.formatEther(poolInfo[1])} tokens`);
  console.log("✅ Pendle-style pricing active with 5% APY");
  console.log("✅ Ready for swapping and yield claiming!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
