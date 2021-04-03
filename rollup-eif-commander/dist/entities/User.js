"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class User {
    constructor(address, balance, nonce) {
        this.address = address;
        this.balance = balance;
        this.nonce = nonce;
    }
    incrementNonce() {
        this.nonce = this.nonce.add(ethers_1.ethers.BigNumber.from("1"));
    }
    incrementBalance(amount) {
        this.balance = this.balance.add(amount);
    }
    decrementBalance(amount) {
        this.balance = this.balance.sub(amount);
    }
    toBytes() {
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "uint256", "uint256"], [this.address, this.balance, this.nonce]));
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map