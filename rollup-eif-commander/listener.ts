const { ethers } = require("ethers");
const RollTokenContract = require("./contracts/RollToken.json");
const AccountRegistryContract = require("./contracts/AccountRegistry.json");

const web3provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545/"
);

const RollTokenContractInstance = new ethers.Contract(
  RollTokenContract.address,
  RollTokenContract.abi,
  web3provider
);

const AccountRegistryContractInstance = new ethers.Contract(
  AccountRegistryContract.address,
  AccountRegistryContract.abi,
  web3provider
);

RollTokenContractInstance.on("Minted", async (value, msg) => {
  console.log(value, msg);
});

AccountRegistryContractInstance.on("SinglePubkeyRegistered", async (msg) => {
  console.log(msg);
});
