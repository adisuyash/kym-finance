const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Pool Status...\n");

  // Contract addresses (deployed 2025-09-30)
  const MOCK_AMM_ADDRESS = "0x5158337793D9913b5967B91a32bB328521D7C7fb";
  const YIELD_SPLITTER_ADDRESS = "0x5405d3e877636212CBfBA5Cd7415ca8C26700Bf4";

  const [deployer] = await ethers.getSigners();
  console.log("👤 Checking as:", deployer.address);

  // Get contract instances
  const mockAMM = await ethers.getContractAt("MockAMM", MOCK_AMM_ADDRESS);
  const yieldSplitter = await ethers.getContractAt("YieldSplitter", YIELD_SPLITTER_ADDRESS);

  // Get PT and YT addresses
  const ptAddress = await yieldSplitter.principalToken();
  const ytAddress = await yieldSplitter.yieldToken();
  const principalToken = await ethers.getContractAt("PrincipalToken", ptAddress);
  const yieldToken = await ethers.getContractAt("YieldToken", ytAddress);

  console.log("\n📍 Contract Addresses:");
  console.log("MockAMM:", MOCK_AMM_ADDRESS);
  console.log("PT:", ptAddress);
  console.log("YT:", ytAddress);

  // Check pool reserves
  const ptReserve = await mockAMM.ptReserve();
  const ytReserve = await mockAMM.ytReserve();

  console.log("\n🏊 Pool Reserves:");
  console.log("PT Reserve:", ethers.formatEther(ptReserve), "PT");
  console.log("YT Reserve:", ethers.formatEther(ytReserve), "YT");

  if (ptReserve > 0n && ytReserve > 0n) {
    console.log("✅ Pool is initialized and has liquidity!");

    // Get pool info
    const poolInfo = await mockAMM.getPoolInfo();
    console.log("\n📊 Pool Info:");
    console.log("PT Reserve:", ethers.formatEther(poolInfo[0]));
    console.log("YT Reserve:", ethers.formatEther(poolInfo[1]));
    console.log("PT Price:", ethers.formatEther(poolInfo[2]));
    console.log("YT Price:", ethers.formatEther(poolInfo[3]));

    // Check deployer balances
    const ptBalance = await principalToken.balanceOf(deployer.address);
    const ytBalance = await yieldToken.balanceOf(deployer.address);

    console.log("\n💰 Your Balances:");
    console.log("PT:", ethers.formatEther(ptBalance));
    console.log("YT:", ethers.formatEther(ytBalance));
  } else {
    console.log("❌ Pool is not initialized (no liquidity)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Check failed:", error);
    process.exit(1);
  });
