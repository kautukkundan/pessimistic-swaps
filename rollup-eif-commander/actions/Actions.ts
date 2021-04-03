import { ethers } from "ethers";
import DataStore from "../datastore/datastore";
import Transaction from "../entities/Transaction";

class Actions {
  database: DataStore;

  constructor() {}

  async loadDb() {
    this.database = new DataStore();
    await this.database.fromJson();
  }

  async transferTokens(from: number, to: number, amount: ethers.BigNumber) {
    let tx = new Transaction(this.database, from, to, amount);
    let signature = await tx.execute();
    return { txMsg: tx.toMessage(), txBytes: tx.toBytes(), signature };
  }
}

export default Actions;
