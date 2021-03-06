import { ethers } from "ethers";
import Rollup from "./contracts/Rollup";
import DataStore from "./datastore/datastore";
import MerkelTree from "./entities/AccountTree";
import Events from "./events/Events";

let web3provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545/"
);

let database = new DataStore();
database.initNew();

let accountsTree = new MerkelTree(4);
accountsTree.toJson();

let events = new Events(database, accountsTree);

let RollupContractInstance = new ethers.Contract(
  Rollup.address,
  Rollup.abi,
  web3provider
);

console.log("Initialized Commander");

RollupContractInstance.on("AccountRegistered", async (address, balance) => {
  events.newAccountRegistered(address, balance);
});
