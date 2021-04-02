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

  transferTokens(to: number, from: number, amount: ethers.BigNumber) {
    let tx = new Transaction(this.database, to, from, amount);
    tx.execute();
  }
}

export default Actions;
