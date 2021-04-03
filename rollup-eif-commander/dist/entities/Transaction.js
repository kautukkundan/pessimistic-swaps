"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const sampleKeys_1 = __importDefault(require("../utils/sampleKeys"));
class Transaction {
    constructor(database, from, to, amount) {
        this.database = database;
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.to <= this.database.length && this.from <= this.database.length) {
                let userFrom = this.database.getMemberFromStateId(this.from).user;
                let userTo = this.database.getMemberFromStateId(this.to).user;
                if (userFrom.balance.gte(this.amount)) {
                    let userFromPvtKey = sampleKeys_1.default.filter((key) => {
                        return key.address === userFrom.address;
                    })[0].secretHex;
                    userFrom.incrementNonce();
                    userFrom.decrementBalance(this.amount);
                    userTo.incrementBalance(this.amount);
                    console.log(userFromPvtKey);
                    console.log(this.toMessage());
                    let wallet = new ethers_1.ethers.Wallet(userFromPvtKey);
                    let signature = yield wallet.signMessage(this.toMessage());
                    this.database.toJson();
                    return signature;
                }
                else {
                    throw Error("insufficient Balance for transfer");
                }
            }
            else {
                throw Error("invalid State Ids");
            }
        });
    }
    toBytes() {
        let userFrom = this.database.getMemberFromStateId(this.from).user;
        let userTo = this.database.getMemberFromStateId(this.to).user;
        return ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "address", "uint256", "uint256"], [userFrom.address, userTo.address, this.amount, userFrom.nonce.add(1)]);
    }
    toMessage() {
        let userFrom = this.database.getMemberFromStateId(this.from).user;
        let userTo = this.database.getMemberFromStateId(this.to).user;
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "address", "uint256", "uint256"], [userFrom.address, userTo.address, this.amount, userFrom.nonce.add(1)]));
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map