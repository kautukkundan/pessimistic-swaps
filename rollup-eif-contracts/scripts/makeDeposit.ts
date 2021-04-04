import { ethers } from "hardhat";

async function main() {
  let ERC20abi = [
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  let [owner, acc1, acc2] = await ethers.getSigners();

  let underlyingAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollupAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let rollup = RollupContract.attach(rollupAddress);

  let UnderlyingContract = new ethers.Contract(
    underlyingAddress,
    ERC20abi,
    owner
  );
  await UnderlyingContract.approve(rollupAddress, ethers.constants.MaxUint256);

  await rollup
    .connect(owner)
    .deposit(
      [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5",
        "0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30",
        "0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85",
      ],
      ethers.BigNumber.from("10")
    );

  await rollup
    .connect(owner)
    .deposit(
      [
        "0x44b9c93353c7379dfd80a18717a60fe42a028322a19a6476afe722055efb3335",
        "0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5",
        "0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30",
        "0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85",
      ],
      ethers.BigNumber.from("10")
    );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
