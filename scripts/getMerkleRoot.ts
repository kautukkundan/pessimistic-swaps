// @ts-ignore
import { ethers } from "hardhat";
import getRootHash from "../dist/actions/getMerkleRoot";

async function main() {
  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollupAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
  let rollup = RollupContract.attach(rollupAddress);

  // get root hash from rollup contract
  let rootL1 = await rollup.rootL1();

  // get root has from Layer 2 commander
  let rootL2 = await getRootHash();

  console.log(`merkle root on L1 = ${rootL1}`);
  console.log(`merkle root on L2 = ${rootL2}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
