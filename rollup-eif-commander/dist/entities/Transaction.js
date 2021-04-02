"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class Transaction {
    constructor(database, to, from, amount) {
        this.database = database;
        this.to = to;
        this.from = from;
        this.amount = amount;
    }
    execute() {
        let userTo = this.database.getMemberFromStateId(this.to).user;
        let userFrom = this.database.getMemberFromStateId(this.from).user;
        if (userFrom.balance.gte(this.amount)) {
            userFrom.balance = userFrom.balance.sub(this.amount);
            userFrom.nonce = userFrom.nonce.add(1);
            userTo.balance = userTo.balance.add(this.amount);
            this.database.toJson();
        }
        else {
            throw Error("insufficient Balance for transfer");
        }
    }
    toBytes() {
        let userTo = this.database.getMemberFromStateId(this.to).user;
        let userFrom = this.database.getMemberFromStateId(this.from).user;
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "address", "uint256", "uint256"], [userTo.address, userFrom.address, this.amount, userFrom.nonce.add(1)]));
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map