const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance));

  const BlockID = await ethers.getContractFactory("BlockID");
  const blockID = await BlockID.deploy();

  await blockID.deployed();
  console.log("BlockID deployed to:", blockID.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
