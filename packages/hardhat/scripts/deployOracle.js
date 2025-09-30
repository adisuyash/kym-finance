const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Oracle with account:", deployer.address);

    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy("0x70523434ee6a9870410960E2615406f8F9850676"); // Orochi contract
    await oracle.deployed();

    console.log("Oracle deployed at:", oracle.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
