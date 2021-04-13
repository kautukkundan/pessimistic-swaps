// @ts-ignore
import { ethers } from "hardhat";

async function main() {
  let ERC20abi = ["function balanceOf(address) view returns (uint)"];
  let DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  let [owner, ...others] = await ethers.getSigners();

  // create contract instance for ERC-20
  let UnderlyingContract = new ethers.Contract(DAIAddress, ERC20abi, owner);

  // list of impersonated accounts
  let impersonated_accounts = [
    "0x13aec50f5D3c011cd3fed44e2a30C515Bd8a5a06",
    "0x16463c0fdB6BA9618909F5b120ea1581618C1b9E",
    "0x01Ec5e7e03e2835bB2d1aE8D2edDEd298780129c",
    "0xC2C5A77d9f434F424Df3d39de9e90d95A0Df5Aca",
    "0x5d96323D8585F832689D33d407C4c9380DADc0f3",
    "0x0Aa06220802f263bdE9B8eDA0F607ea237084D5B",
    "0x3CC9063E7AC5fa8345e1F59bC32a470ccd30cA6d",
    "0xcd6Eb888e76450eF584E8B51bB73c76ffBa21FF2",
    "0x84cd3d5438f63d70F6Af5E721adb016AAFaac7de",
    "0xa3692f4c74E36b984551F329239E7387eEF63f26",
  ];

  // get DAI balance for each account
  for await (const account of impersonated_accounts) {
    let balance = await UnderlyingContract.balanceOf(account);
    console.log(
      `account: ${account} | ${ethers.utils.formatEther(balance)} DAI`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
