// @ts-ignore
import { ethers } from "hardhat";
import getNextSibling from "../dist/actions/getNextSibling";

async function main() {
  let ERC20abi = [
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  let [owner, acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners();

  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollupAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let rollup = RollupContract.attach(rollupAddress);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for await (const signer of [acc1, acc2, acc3, acc4, acc5]) {
    let siblings = await getNextSibling();
    console.log(siblings);

    await rollup
      .connect(signer)
      .deposit(siblings, ethers.BigNumber.from("200"));

    // add delay to wait for commander to append leaves to merkle tree
    // before sending another address
    console.log("waiting for 7 seconds");
    await delay(5000);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
