// @ts-ignore
import { ethers } from "hardhat";
import makeSwap from "../dist/actions/makeSwap";

async function main() {
  let rollupAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";

  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollup = RollupContract.attach(rollupAddress);

  let initialStates = await makeSwap();

  await rollup.swap(initialStates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
