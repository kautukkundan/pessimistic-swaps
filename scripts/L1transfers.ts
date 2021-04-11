// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  let ERC20abi = [
    "function transfer(address recipient, uint256 amount) public returns (bool)",
  ];

  let [owner, acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners();

  let underlyingAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";

  // create contract instance for ERC-20
  let UnderlyingContract = new ethers.Contract(
    underlyingAddress,
    ERC20abi,
    owner
  );

  // distribute ERC20 to 5 accounts
  await UnderlyingContract.connect(acc1).transfer(
    await acc2.getAddress(),
    ethers.utils.parseEther("200")
  );
  await UnderlyingContract.connect(acc2).transfer(
    await acc3.getAddress(),
    ethers.utils.parseEther("100")
  );
  await UnderlyingContract.connect(acc3).transfer(
    await acc4.getAddress(),
    ethers.utils.parseEther("50")
  );
  await UnderlyingContract.connect(acc4).transfer(
    await acc5.getAddress(),
    ethers.utils.parseEther("150")
  );
  await UnderlyingContract.connect(acc5).transfer(
    await acc1.getAddress(),
    ethers.utils.parseEther("100")
  );
  await UnderlyingContract.connect(acc5).transfer(
    await acc2.getAddress(),
    ethers.utils.parseEther("20")
  );
  await UnderlyingContract.connect(acc5).transfer(
    await acc3.getAddress(),
    ethers.utils.parseEther("60")
  );
  await UnderlyingContract.connect(acc4).transfer(
    await acc1.getAddress(),
    ethers.utils.parseEther("50")
  );
  await UnderlyingContract.connect(acc3).transfer(
    await acc2.getAddress(),
    ethers.utils.parseEther("100")
  );
  await UnderlyingContract.connect(acc2).transfer(
    await acc5.getAddress(),
    ethers.utils.parseEther("90")
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
