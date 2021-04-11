// @ts-ignore
import { ethers } from "hardhat";
import makeWithdraw from "../dist/actions/makeWithdraw";

async function main() {
  let [owner, ...others] = await ethers.getSigners();

  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollupAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let rollup = RollupContract.attach(rollupAddress);

  let { initialState, txData } = await makeWithdraw();

  await rollup.connect(owner).withdraw(txData, initialState);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
