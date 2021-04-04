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

    let siblings = this.accountsTree.getSiblings(
      this.accountsTree.nextLeafIndex
    );

    this.accountsTree.insertLeaf(siblings, newUser.toBytes());
    this.database.addMember(newUser);

    let siblingsNext = this.accountsTree.getSiblings(
      this.accountsTree.nextLeafIndex
    );
    console.log({ siblingsNext });
  };
}

export default Events;
