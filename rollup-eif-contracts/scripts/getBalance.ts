import { ethers } from "hardhat";

async function main() {
  let ERC20abi = [
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];
  let underlyingAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
  let rollupAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  let [owner, ...others] = await ethers.getSigners();

  let UnderlyingContract = new ethers.Contract(
    underlyingAddress,
    ERC20abi,
    owner
  );
  let balance = await UnderlyingContract.balanceOf(await owner.getAddress());
  console.log(balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
