import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import MerkelTree from "../entities/AccountTree";
import Transaction from "../entities/Transaction";

class Actions {
  database: DataStore;
  accountTree: MerkelTree;

  constructor() {}

  async loadDb() {
    this.database = new DataStore();
    await this.database.fromJson();
  }

  async loadTree() {
    this.accountTree = new MerkelTree(4);
    await this.accountTree.fromJson();
  }

  async transferTokens(from: number, to: number, amount: ethers.BigNumber) {
    let tx = new Transaction(this.database, this.accountTree, from, to, amount);
    await tx.execute();
    return tx;
  }
}

export default Actions;
