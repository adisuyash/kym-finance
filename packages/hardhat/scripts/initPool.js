const { ethers } = require("hardhat");

async function main() {
  console.log("🏊 Initializing AMM Pool...");

  // Contract addresses (updated with new deployment)
  const MOCK_AMM_ADDRESS = "0x3aE2a95a17aEdb8B53d0EBa6715336274b098DbF";
  const YIELD_SPLITTER_ADDRESS = "0x81485FBD886d262b671F1789FB066366619eA8c7";

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Get contract instances
  const mockAMM = await ethers.getContractAt("MockAMM", MOCK_AMM_ADDRESS);
  const yieldSplitter = await ethers.getContractAt("YieldSplitter", YIELD_SPLITTER_ADDRESS);

  // Get PT and YT addresses
  const ptAddress = await yieldSplitter.principalToken();
  const ytAddress = await yieldSplitter.yieldToken();
  const principalToken = await ethers.getContractAt("PrincipalToken", ptAddress);
  const yieldToken = await ethers.getContractAt("YieldToken", ytAddress);

  console.log("📍 PT Address:", ptAddress);
  console.log("📍 YT Address:", ytAddress);

  // Check current balances
  const ptBalance = await principalToken.balanceOf(deployer.address);
  const ytBalance = await yieldToken.balanceOf(deployer.address);

  console.log(`📊 Deployer PT: ${ethers.formatEther(ptBalance)}`);
  console.log(`📊 Deployer YT: ${ethers.formatEther(ytBalance)}`);

  if (ptBalance === 0n || ytBalance === 0n) {
    console.log("❌ Deployer has no PT/YT tokens. Need to split some wU2U first.");
    return;
  }

  // Use very small amounts for initialization
  const initAmount = ethers.parseEther("0.001"); // 0.001 tokens

  console.log("🔓 Approving tokens...");
  await principalToken.approve(MOCK_AMM_ADDRESS, initAmount);
  await yieldToken.approve(MOCK_AMM_ADDRESS, initAmount);

  console.log("🏊 Adding initial liquidity...");
  await mockAMM.addInitialLiquidity(initAmount, initAmount);

  console.log("✅ Pool initialized successfully!");

  // Check pool info
  const poolInfo = await mockAMM.getPoolInfo();
  console.log(`📊 Pool: ${ethers.formatEther(poolInfo[0])} PT, ${ethers.formatEther(poolInfo[1])} YT`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Pool initialization failed:", error);
    process.exit(1);
  });
