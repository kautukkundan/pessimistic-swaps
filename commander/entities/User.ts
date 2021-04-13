import { ethers } from "ethers";

class User {
  address: string;
  balance: ethers.BigNumber;

  constructor(address: string, balance: ethers.BigNumber) {
    this.address = address;
    this.balance = balance;
  }

  incrementBalance(amount: ethers.BigNumber) {
    this.balance = this.balance.add(amount);
  }

  decrementBalance(amount: ethers.BigNumber) {
    this.balance = this.balance.sub(amount);
  }

  toBytes() {
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [this.address, this.balance]
      )
    );
  }
}

export default User;
