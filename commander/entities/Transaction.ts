import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import sampleKeys from "../utils/sampleKeys";
import MerkelTree from "./AccountTree";
import User from "./User";

class Transaction {
  to: number;
  from: number;
  amount: ethers.BigNumber;
  database: DataStore;
  accountTree: MerkelTree;
  signature: string;
  siblingsFrom: string[];
  siblingsTo: string[];

  constructor(
    database: DataStore,
    accountTree: MerkelTree,
    from: number,
    to: number,
    amount: ethers.BigNumber
  ) {
    this.database = database;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.accountTree = accountTree;
  }

  updateStateTree(userFrom: User, userTo: User) {
    let proofsFrom = this.accountTree.getSiblings(this.from);
    this.siblingsFrom = proofsFrom;

    // console.log(proofsFrom);
    // console.log(userFrom);

    this.accountTree.insertAt(proofsFrom, userFrom.toBytes(), this.from);

    let proofsTo = this.accountTree.getSiblings(this.to);
    this.siblingsTo = proofsTo;

    // console.log(proofsTo);
    // console.log(userTo);

    this.accountTree.insertAt(proofsTo, userTo.toBytes(), this.to);
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

  getUserTo() {
    return this.database.getMemberFromStateId(this.to).user;
  }

  async execute() {
    if (this.to <= this.database.length && this.from <= this.database.length) {
      let userFrom = this.getUserFrom();
      let userTo = this.getUserTo();

      if (userFrom.balance.gte(this.amount)) {
        userFrom.incrementNonce();
        userFrom.decrementBalance(this.amount);
        userTo.incrementBalance(this.amount);

        await this.createSignature(userFrom);
        this.updateStateTree(userFrom, userTo);

        this.database.toJson();
      } else {
        throw Error("insufficient Balance for transfer");
      }
    } else {
      throw Error("invalid State Ids");
    }
  }

  toBytes() {
    let userFrom = this.database.getMemberFromStateId(this.from).user;
    let userTo = this.database.getMemberFromStateId(this.to).user;

    return ethers.utils.defaultAbiCoder.encode(
      [
        "uint256",
        "address",
        "uint256",
        "uint256",
        "uint256",
        "address",
        "uint256",
        "uint256",
      ],
      [
        this.from,
        userFrom.address,
        userFrom.balance,
        userFrom.nonce,
        this.to,
        userTo.address,
        userTo.balance,
        userTo.nonce,
      ]
    );
  }

  toMessage() {
    return ethers.utils.keccak256(this.toBytes());
  }
}

export default Transaction;
