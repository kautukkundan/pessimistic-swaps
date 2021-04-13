import DataStore from "../datastore/datastore";
import MerkelTree from "../entities/AccountTree";

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
    return { address: user.address, balance: user.balance };
  }
}

export default Actions;
