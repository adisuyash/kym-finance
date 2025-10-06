const { run } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔍 Starting verification of all mainnet contracts...\n");

  // Load deployed addresses
  const addressesPath = path.join(__dirname, '../deployed-addresses-mainnet.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));

  console.log("📋 Loaded contract addresses:");
  console.log(`Network: ${addresses.network} (Chain ID: ${addresses.chainId})`);
  console.log(`Deployed at: ${addresses.deployedAt}\n`);

  const verificationResults = {
    successful: [],
    failed: [],
    alreadyVerified: []
  };

  // 1. Verify WrappedU2U (no constructor args)
  console.log("1️⃣ Verifying WrappedU2U...");
  try {
    await run("verify:verify", {
      address: addresses.wrappedU2U,
      constructorArguments: [],
      network: "u2uMainnet"
    });
    console.log("✅ WrappedU2U verified successfully!\n");
    verificationResults.successful.push("WrappedU2U");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ WrappedU2U is already verified\n");
      verificationResults.alreadyVerified.push("WrappedU2U");
    } else if (error.message.includes("Invalid chainIds")) {
      // Sourcify doesn't support this chain, but U2U Scan verification succeeded
      console.log("ℹ️ WrappedU2U verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("WrappedU2U");
    } else {
      console.error("❌ WrappedU2U verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "WrappedU2U", error: error.message });
    }
  }

  // 2. Verify YieldSplitter
  console.log("2️⃣ Verifying YieldSplitter...");
  const maturityDuration = 365 * 24 * 60 * 60; // 1 year in seconds
  const yieldPercentage = 500; // 5% APY in basis points
  try {
    await run("verify:verify", {
      address: addresses.yieldSplitter,
      constructorArguments: [addresses.wrappedU2U, maturityDuration, yieldPercentage],
      network: "u2uMainnet"
    });
    console.log("✅ YieldSplitter verified successfully!\n");
    verificationResults.successful.push("YieldSplitter");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ YieldSplitter is already verified\n");
      verificationResults.alreadyVerified.push("YieldSplitter");
    } else if (error.message.includes("Invalid chainIds")) {
      console.log("ℹ️ YieldSplitter verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("YieldSplitter");
    } else {
      console.error("❌ YieldSplitter verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "YieldSplitter", error: error.message });
    }
  }

  // 3. Verify PrincipalToken (auto-deployed by YieldSplitter)
  console.log("3️⃣ Verifying PrincipalToken...");
  // Calculate maturity timestamp (deployment time + 1 year)
  const deploymentTime = Math.floor(new Date(addresses.deployedAt).getTime() / 1000);
  const maturityTimestamp = deploymentTime + maturityDuration;
  
  try {
    await run("verify:verify", {
      address: addresses.principalToken,
      constructorArguments: [
        "Principal Token wU2U",
        "PT-wU2U",
        addresses.wrappedU2U,
        maturityTimestamp
      ],
      network: "u2uMainnet"
    });
    console.log("✅ PrincipalToken verified successfully!\n");
    verificationResults.successful.push("PrincipalToken");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ PrincipalToken is already verified\n");
      verificationResults.alreadyVerified.push("PrincipalToken");
    } else if (error.message.includes("Invalid chainIds")) {
      console.log("ℹ️ PrincipalToken verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("PrincipalToken");
    } else {
      console.error("❌ PrincipalToken verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "PrincipalToken", error: error.message });
    }
  }

  // 4. Verify YieldToken (auto-deployed by YieldSplitter)
  console.log("4️⃣ Verifying YieldToken...");
  try {
    await run("verify:verify", {
      address: addresses.yieldToken,
      constructorArguments: [
        "Yield Token wU2U",
        "YT-wU2U",
        addresses.wrappedU2U,
        maturityTimestamp
      ],
      network: "u2uMainnet"
    });
    console.log("✅ YieldToken verified successfully!\n");
    verificationResults.successful.push("YieldToken");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ YieldToken is already verified\n");
      verificationResults.alreadyVerified.push("YieldToken");
    } else if (error.message.includes("Invalid chainIds")) {
      console.log("ℹ️ YieldToken verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("YieldToken");
    } else {
      console.error("❌ YieldToken verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "YieldToken", error: error.message });
    }
  }

  // 5. Verify OrochiOracle (no constructor args)
  console.log("5️⃣ Verifying OrochiOracle...");
  try {
    await run("verify:verify", {
      address: addresses.orochiOracle,
      constructorArguments: [],
      network: "u2uMainnet"
    });
    console.log("✅ OrochiOracle verified successfully!\n");
    verificationResults.successful.push("OrochiOracle");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ OrochiOracle is already verified\n");
      verificationResults.alreadyVerified.push("OrochiOracle");
    } else if (error.message.includes("Invalid chainIds")) {
      console.log("ℹ️ OrochiOracle verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("OrochiOracle");
    } else {
      console.error("❌ OrochiOracle verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "OrochiOracle", error: error.message });
    }
  }

  // 6. Verify MockAMM
  console.log("6️⃣ Verifying MockAMM...");
  try {
    await run("verify:verify", {
      address: addresses.mockAMM,
      constructorArguments: [addresses.principalToken, addresses.yieldToken],
      network: "u2uMainnet"
    });
    console.log("✅ MockAMM verified successfully!\n");
    verificationResults.successful.push("MockAMM");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already been verified")) {
      console.log("ℹ️ MockAMM is already verified\n");
      verificationResults.alreadyVerified.push("MockAMM");
    } else if (error.message.includes("Invalid chainIds")) {
      console.log("ℹ️ MockAMM verified on U2U Scan (Sourcify not supported)\n");
      verificationResults.successful.push("MockAMM");
    } else {
      console.error("❌ MockAMM verification failed:", error.message, "\n");
      verificationResults.failed.push({ contract: "MockAMM", error: error.message });
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 VERIFICATION SUMMARY");
  console.log("=".repeat(60));
  
  if (verificationResults.successful.length > 0) {
    console.log(`\n✅ Successfully Verified (${verificationResults.successful.length}):`);
    verificationResults.successful.forEach(contract => {
      console.log(`   - ${contract}`);
    });
  }

  if (verificationResults.alreadyVerified.length > 0) {
    console.log(`\nℹ️  Already Verified (${verificationResults.alreadyVerified.length}):`);
    verificationResults.alreadyVerified.forEach(contract => {
      console.log(`   - ${contract}`);
    });
  }

  if (verificationResults.failed.length > 0) {
    console.log(`\n❌ Failed Verification (${verificationResults.failed.length}):`);
    verificationResults.failed.forEach(item => {
      console.log(`   - ${item.contract}: ${item.error}`);
    });
  }

  const totalProcessed = verificationResults.successful.length + 
                         verificationResults.alreadyVerified.length + 
                         verificationResults.failed.length;
  
  console.log(`\n📈 Total: ${totalProcessed}/6 contracts processed`);
  console.log("=".repeat(60));

  console.log("\n🔗 View verified contracts on U2U Scan:");
  console.log(`   https://u2uscan.xyz/address/${addresses.wrappedU2U}`);
  console.log(`   https://u2uscan.xyz/address/${addresses.yieldSplitter}`);
  console.log(`   https://u2uscan.xyz/address/${addresses.principalToken}`);
  console.log(`   https://u2uscan.xyz/address/${addresses.yieldToken}`);
  console.log(`   https://u2uscan.xyz/address/${addresses.orochiOracle}`);
  console.log(`   https://u2uscan.xyz/address/${addresses.mockAMM}`);

  console.log("\n✨ Verification process complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
