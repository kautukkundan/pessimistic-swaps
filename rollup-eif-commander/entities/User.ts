import { ethers } from "ethers";

class User {
  address: string;
  balance: ethers.BigNumber;
  nonce: ethers.BigNumber;

  constructor(
    address: string,
    balance: ethers.BigNumber,
    nonce: ethers.BigNumber
  ) {
    this.address = address;
    this.balance = balance;
    this.nonce = nonce;
  }

  incrementNonce() {
    this.nonce.add(ethers.BigNumber.from("1"));
  }

  updateBalance(amount: ethers.BigNumber) {
    this.balance = amount;
  }

  toBytes() {
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "uint256"],
        [this.address, this.balance, this.nonce]
      )
    );
  }
}

export default User;
