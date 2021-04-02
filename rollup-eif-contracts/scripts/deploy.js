const hre = require("hardhat");

async function main() {
  const RollToken = await hre.ethers.getContractFactory("RollToken");
  const rollToken = await RollToken.deploy();

  await rollToken.deployed();

  console.log("RollToken deployed to:", rollToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
