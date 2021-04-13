// @ts-ignore
import { ethers, network } from "hardhat";

async function main() {
  let DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  let ERC20abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  let [owner, ...others] = await ethers.getSigners();
  let UnderlyingContract = new ethers.Contract(DAIAddress, ERC20abi, owner);

  let impersonated_accounts = [
    { address: "0x13aec50f5D3c011cd3fed44e2a30C515Bd8a5a06", amount: "200000" },
    { address: "0x16463c0fdB6BA9618909F5b120ea1581618C1b9E", amount: "250000" },
    { address: "0x01Ec5e7e03e2835bB2d1aE8D2edDEd298780129c", amount: "350000" },
    { address: "0xC2C5A77d9f434F424Df3d39de9e90d95A0Df5Aca", amount: "300000" },
    { address: "0x5d96323D8585F832689D33d407C4c9380DADc0f3", amount: "100000" },
    { address: "0x0Aa06220802f263bdE9B8eDA0F607ea237084D5B", amount: "100000" },
    { address: "0x3CC9063E7AC5fa8345e1F59bC32a470ccd30cA6d", amount: "110000" },
    { address: "0xcd6Eb888e76450eF584E8B51bB73c76ffBa21FF2", amount: "80000" },
    { address: "0x84cd3d5438f63d70F6Af5E721adb016AAFaac7de", amount: "500000" },
    { address: "0xa3692f4c74E36b984551F329239E7387eEF63f26", amount: "120000" },
  ];

  let BatchedSwapsContract = await ethers.getContractFactory("BatchedSwaps");
  let batchedSwaps = await BatchedSwapsContract.connect(owner).deploy();

  for await (const account of impersonated_accounts) {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [account.address],
    });

    let signer = await ethers.provider.getSigner(account.address);

    await UnderlyingContract.connect(signer).approve(
      batchedSwaps.address,
      ethers.constants.MaxUint256
    );

    await batchedSwaps
      .connect(signer)
      .deposit(ethers.utils.parseEther(account.amount));

    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [account.address],
    });
  }

  await batchedSwaps.connect(owner).swap();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
