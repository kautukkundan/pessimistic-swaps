import { ethers } from "ethers";
import User from "../entities/User";
var fs = require("fs");
const path = require("path");
let filename = path.join(__dirname, "datastore.json");

interface DataRow {
  user: User;
  stateId: number;
}

interface IFlattened {
  address: string;
  balance: ethers.BigNumber;
  nonce: ethers.BigNumber;
  stateId: number;
}

class DataStore {
  userData: DataRow[];
  length: number;

  constructor() {
    this.userData = [];
    this.length = 0;
  }

  resetDB() {
    this.userData = [];
    this.length = 0;
    this.toJson();
  }

  initNew() {
    fs.writeFileSync(filename, JSON.stringify([]), "utf8", () => {
      console.log("saved");
    });
  }

  addMember(user: User) {
    this.userData.push({ user: user, stateId: this.length });
    this.length += 1;
    this.toJson();
  }

  getMember(address: string) {
    return this.userData.filter((user) => {
      return user.user.address === address;
    })[0];
  }

  getMemberFromStateId(stateId: number) {
    return this.userData.filter((user) => {
      return user.stateId === stateId;
    })[0];
  }

  toJson() {
    let flattened = [];
    this.userData.forEach((element) => {
      flattened.push({
        address: element.user.address,
        balance: element.user.balance.toString(),
        nonce: element.user.nonce.toString(),
        stateId: element.stateId,
      });
    });
    let dataJson = JSON.stringify(flattened, null, 4);
    fs.writeFileSync(filename, dataJson, "utf8");
  }

  async fromJson() {
    let jsonString = await fs.readFileSync(filename, "utf8");
    let flattened: IFlattened[] = JSON.parse(jsonString);
    let unflattened: DataRow[] = [];
    flattened.forEach((element) => {
      unflattened.push({
        user: new User(
          element.address,
          ethers.BigNumber.from(element.balance),
          ethers.BigNumber.from(element.nonce)
        ),
        stateId: element.stateId,
      });
    });
    this.userData = unflattened;
    this.length = unflattened.length;
  }
}

export default DataStore;
