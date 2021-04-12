import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import MerkelTree from "../entities/AccountTree";
import Transaction from "../entities/Transaction";
import Withdraw from "../entities/Withdraw";

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

  async withdrawTokens(from: number, amount: ethers.BigNumber) {
    let tx = new Withdraw(this.database, this.accountTree, from, amount);
    await tx.execute();
    return tx;
  }

  getNextSibling() {
    return this.accountTree.getSiblings(this.accountTree.nextLeafIndex);
  }

  getMerkleRoot() {
    return this.accountTree.rootHash;
  }

  getBalanceOfUser(stateId: number) {
    let user = this.database.getMemberFromStateId(stateId).user;
    return { address: user.address, balance: user.balance };
  }

  getUserDetails(stateId: number) {
    let user = this.database.getMemberFromStateId(stateId).user;
    return { address: user.address, balance: user.balance, nonce: user.nonce };
  }
}

export default Actions;
