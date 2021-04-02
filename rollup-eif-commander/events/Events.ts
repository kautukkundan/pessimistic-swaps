import DataStore from "../datastore/datastore";
import MerkelTree from "../entities/AccountTree";
import User from "../entities/User";

class Events {
  database: DataStore;
  accountsTree: MerkelTree;

  constructor(database: DataStore, accountsTree: MerkelTree) {
    this.database = database;
    this.accountsTree = accountsTree;
  }

  newAccountRegistered = (address, balance, nonce) => {
    let newUser = new User(address, balance, nonce);
    this.accountsTree.insertLeaf(newUser.toBytes());
    this.database.addMember(newUser);
  };
}

export default Events;
