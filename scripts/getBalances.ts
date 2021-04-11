// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  let ERC20abi = ["function balanceOf(address) view returns (uint)"];
  let underlyingAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";

  let [owner, acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners();

  // create contract instance for ERC-20
  let UnderlyingContract = new ethers.Contract(
    underlyingAddress,
    ERC20abi,
    owner
  );

  // get list of addresses
  let accountAddresses = await Promise.all(
    [acc1, acc2, acc3, acc4, acc5].map(async (acc) => {
      return await acc.getAddress();
    })
  );

  // get address-balance
  for await (const address of accountAddresses) {
    let balance = await UnderlyingContract.balanceOf(address);
    console.log(`account: ${address} | ERC20 balance: ${balance.toString()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
