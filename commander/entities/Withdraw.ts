import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import sampleKeys from "../utils/sampleKeys";
import MerkelTree from "./AccountTree";
import User from "./User";

class Withdraw {
  from: number;
  amount: ethers.BigNumber;
  database: DataStore;
  accountTree: MerkelTree;
  signature: string;
  siblingsFrom: string[];

  constructor(
    database: DataStore,
    accountTree: MerkelTree,
    from: number,
    amount: ethers.BigNumber
  ) {
    this.database = database;
    this.from = from;
    this.amount = amount;
    this.accountTree = accountTree;
  }

  updateStateTree(userFrom: User) {
    let proofsFrom = this.accountTree.getSiblings(this.from);
    this.siblingsFrom = proofsFrom;

    this.accountTree.insertAt(proofsFrom, userFrom.toBytes(), this.from);
  }

  async createSignature(userFrom: User) {
    let userFromPvtKey = sampleKeys.filter((key) => {
      return key.address === userFrom.address;
    })[0].secretHex;

    let wallet = new ethers.Wallet(userFromPvtKey);
    let signature = await wallet.signMessage(this.toMessage());
    this.signature = signature;
  }

  getUserFrom() {
    return this.database.getMemberFromStateId(this.from).user;
  }

  async execute() {
    let userFrom = this.getUserFrom();

    if (userFrom.balance.gte(this.amount)) {
      userFrom.incrementNonce();
      userFrom.decrementBalance(this.amount);

      await this.createSignature(userFrom);
      this.updateStateTree(userFrom);

      this.database.toJson();
    } else {
      throw Error("insufficient Balance for withdraw");
    }
  }

  toBytes() {
    let userFrom = this.database.getMemberFromStateId(this.from).user;

    return ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint256", "uint256", "uint256"],
      [
        this.from,
        userFrom.address,
        userFrom.balance,
        this.amount,
        userFrom.nonce,
      ]
    );
  }

  toMessage() {
    return ethers.utils.keccak256(this.toBytes());
  }
}

export default Withdraw;
