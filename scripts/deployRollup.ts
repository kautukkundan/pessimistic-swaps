// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  const Rollup = await ethers.getContractFactory("Rollup");
  const rollup = await Rollup.deploy();

  await rollup.deployed();
  console.log("Rollup deployed to:\t", rollup.address);

  let underlying = await rollup.underlying();
  console.log("Roll Tokens deployed at:\t", underlying);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
