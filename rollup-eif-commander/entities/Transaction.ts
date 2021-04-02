import { ethers } from "ethers";
import DataStore from "../datastore/datastore";

class Transaction {
  to: number;
  from: number;
  amount: ethers.BigNumber;
  database: DataStore;

  constructor(
    database: DataStore,
    to: number,
    from: number,
    amount: ethers.BigNumber
  ) {
    this.database = database;
    this.to = to;
    this.from = from;
    this.amount = amount;
  }

  execute() {
    if (this.to <= this.database.length && this.from <= this.database.length) {
      let userTo = this.database.getMemberFromStateId(this.to).user;
      let userFrom = this.database.getMemberFromStateId(this.from).user;

      if (userFrom.balance.gte(this.amount)) {
        userFrom.balance = userFrom.balance.sub(this.amount);
        userFrom.nonce = userFrom.nonce.add(1);
        userTo.balance = userTo.balance.add(this.amount);

        this.database.toJson();
      } else {
        throw Error("insufficient Balance for transfer");
      }
    } else {
      throw Error("invalid State Ids");
    }
  }

  toBytes() {
    let userTo = this.database.getMemberFromStateId(this.to).user;
    let userFrom = this.database.getMemberFromStateId(this.from).user;

    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "uint256"],
        [userTo.address, userFrom.address, this.amount, userFrom.nonce.add(1)]
      )
    );
  }
}

export default Transaction;
