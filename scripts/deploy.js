const hre = require("hardhat");

async function main() {
  const SkillNFT = await hre.ethers.getContractFactory("SkillNFT");
  const skillNFT = await SkillNFT.deploy(); // ✅ deploys the contract

  console.log("✅ SkillNFT deployed to:", skillNFT.target); // ✅ .target holds the contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
