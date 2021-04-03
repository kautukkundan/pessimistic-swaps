import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import sampleKeys from "../utils/sampleKeys";

class Transaction {
  to: number;
  from: number;
  amount: ethers.BigNumber;
  database: DataStore;

  constructor(
    database: DataStore,
    from: number,
    to: number,
    amount: ethers.BigNumber
  ) {
    this.database = database;
    this.from = from;
    this.to = to;
    this.amount = amount;
  }

  async execute() {
    if (this.to <= this.database.length && this.from <= this.database.length) {
      let userFrom = this.database.getMemberFromStateId(this.from).user;
      let userTo = this.database.getMemberFromStateId(this.to).user;

      if (userFrom.balance.gte(this.amount)) {
        let userFromPvtKey = sampleKeys.filter((key) => {
          return key.address === userFrom.address;
        })[0].secretHex;

        userFrom.incrementNonce();
        userFrom.decrementBalance(this.amount);
        userTo.incrementBalance(this.amount);
        console.log(userFromPvtKey);
        console.log(this.toMessage());

        let wallet = new ethers.Wallet(userFromPvtKey);
        let signature = await wallet.signMessage(this.toMessage());

        this.database.toJson();
        return signature;
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
      ["address", "address", "uint256", "uint256"],
      [userFrom.address, userTo.address, this.amount, userFrom.nonce.add(1)]
    );
  }

  toMessage() {
    let userFrom = this.database.getMemberFromStateId(this.from).user;
    let userTo = this.database.getMemberFromStateId(this.to).user;

    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "uint256"],
        [userFrom.address, userTo.address, this.amount, userFrom.nonce.add(1)]
      )
    );
  }
}

export default Transaction;
