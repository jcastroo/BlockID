// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0xD1Cf14341c15eD5ACd821fA0FeDdaeb58375c0c3"; 
  const BlockID = await ethers.getContractFactory("BlockID");
  const blockID = await BlockID.attach(contractAddress);

  const tx = await blockID.registerIdentity("João Castro", "joao@email.com", 19900101);
  await tx.wait();
  console.log("Identidade registrada!");

  const txUpdate = await blockID.updateIdentity("João Castro", "joao.novo@email.com", 19900101);
  await txUpdate.wait();
  console.log("Identidade atualizada!");

  const identity = await blockID.getIdentity(deployer.address);
  console.log("Identidade registrada:", identity);

  // Revogar identidade
  const txRevoke = await blockID.revokeIdentity();
  await txRevoke.wait();
  console.log("Identidade revogada!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
