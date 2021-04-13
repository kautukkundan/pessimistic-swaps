// @ts-ignore
import { ethers, network } from "hardhat";
import getNextSibling from "../dist/actions/getNextSibling";

async function main() {
  let rollupAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
  let DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  let RollupContract = await ethers.getContractFactory("Rollup");
  let rollup = RollupContract.attach(rollupAddress);

  let [owner, ...others] = await ethers.getSigners();

  let ERC20abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  let UnderlyingContract = new ethers.Contract(DAIAddress, ERC20abi, owner);

  let impersonated_accounts = [
    { address: "0x13aec50f5D3c011cd3fed44e2a30C515Bd8a5a06", amount: "200000" },
    { address: "0x16463c0fdB6BA9618909F5b120ea1581618C1b9E", amount: "250000" },
    { address: "0x01Ec5e7e03e2835bB2d1aE8D2edDEd298780129c", amount: "350000" },
    { address: "0xC2C5A77d9f434F424Df3d39de9e90d95A0Df5Aca", amount: "300000" },
    { address: "0x5d96323D8585F832689D33d407C4c9380DADc0f3", amount: "100000" },
  ];

  // artificial delay function
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // deposit DAI from each account
  for await (const account of impersonated_accounts) {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [account.address],
    });

    let siblings = await getNextSibling();
    let signer = await ethers.provider.getSigner(account.address);

    await UnderlyingContract.connect(signer).approve(
      rollupAddress,
      ethers.constants.MaxUint256
    );

    await rollup
      .connect(signer)
      .deposit(siblings, ethers.utils.parseEther(account.amount));

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [account.address],
    });

    console.log(
      `${await signer.getAddress()} registered on Layer 2 successfully | ${
        account.amount
      } DAI`
    );
    await delay(5000);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
