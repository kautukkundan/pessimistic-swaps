import { network, ethers } from "hardhat";
import { expect } from "chai";

describe("make deposit", function () {
  let impersonated_account = "0x13aec50f5D3c011cd3fed44e2a30C515Bd8a5a06";
  let underlyingAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  let signer: any;

  let ERC20abi = [
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  before("should create a impersonate account", async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [impersonated_account],
    });

    signer = await ethers.provider.getSigner(impersonated_account);
  });

  it("should perform swap", async function () {
    let ExchangeContract = await ethers.getContractFactory("Exchange");
    let exchange = await ExchangeContract.connect(signer).deploy();

    await exchange.connect(signer).deployed();

    let UnderlyingContract = new ethers.Contract(
      underlyingAddress,
      ERC20abi,
      signer
    );

    let amountEth1 = await exchange.getQuote(ethers.utils.parseEther("2140"));
    console.log(ethers.utils.formatEther(amountEth1));

    let initialEthBalance = await signer.getBalance();

    await UnderlyingContract.approve(
      exchange.address,
      ethers.constants.MaxUint256
    );

    await exchange.performSwap(ethers.utils.parseEther("2140"));

    let finalEthBalance = await signer.getBalance();

    console.log(
      "ETH received",
      ethers.utils.formatEther(finalEthBalance.sub(initialEthBalance))
    );

    // // get quote

    let amountEth2 = await exchange.getQuote(ethers.utils.parseEther("2140"));
    console.log(ethers.utils.formatEther(amountEth2));
  });
});
