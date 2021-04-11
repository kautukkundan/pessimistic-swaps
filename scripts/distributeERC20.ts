// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  let ERC20abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address recipient, uint256 amount) public returns (bool)",
  ];

  let [owner, acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners();

  let underlyingAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
  let rollupAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // create contract instance for ERC-20
  let UnderlyingContract = new ethers.Contract(
    underlyingAddress,
    ERC20abi,
    owner
  );

  // approve spending limit for the owner
  await UnderlyingContract.approve(rollupAddress, ethers.constants.MaxUint256);

  // get list of addresses
  let accountAddresses = await Promise.all(
    [acc1, acc2, acc3, acc4, acc5].map(async (acc) => {
      return await acc.getAddress();
    })
  );

  // distribute ERC20 to 5 accounts
  for await (const address of accountAddresses) {
    await UnderlyingContract.transfer(address, ethers.utils.parseEther("200"));
  }

  // give allowance of ERC20 to each account
  for await (const signer of [acc1, acc2, acc3, acc4, acc5]) {
    await UnderlyingContract.connect(signer).approve(
      rollupAddress,
      ethers.constants.MaxUint256
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
