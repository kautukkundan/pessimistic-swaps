// @ts-ignore
import { ethers } from "hardhat";
import makeTransfer from "../dist/actions/makeTransfer";

async function main() {
  let [owner, ...others] = await ethers.getSigners();

  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollupAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let rollup = RollupContract.attach(rollupAddress);

  let { initialState, txData } = await makeTransfer();

  console.log("Applying transactions on-chain");
  await rollup.connect(owner).applyTransactions(txData, initialState);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
