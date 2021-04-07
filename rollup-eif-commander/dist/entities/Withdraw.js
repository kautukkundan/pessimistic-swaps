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
class Withdraw {
    constructor(database, accountTree, from, amount) {
        this.database = database;
        this.from = from;
        this.amount = amount;
        this.accountTree = accountTree;
    }
    updateStateTree(userFrom) {
        let proofsFrom = this.accountTree.getSiblings(this.from);
        this.siblingsFrom = proofsFrom;
        this.accountTree.insertAt(proofsFrom, userFrom.toBytes(), this.from);
    }
    createSignature(userFrom) {
        return __awaiter(this, void 0, void 0, function* () {
            let userFromPvtKey = sampleKeys_1.default.filter((key) => {
                return key.address === userFrom.address;
            })[0].secretHex;
            let wallet = new ethers_1.ethers.Wallet(userFromPvtKey);
            let signature = yield wallet.signMessage(this.toMessage());
            this.signature = signature;
        });
    }
    getUserFrom() {
        return this.database.getMemberFromStateId(this.from).user;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let userFrom = this.getUserFrom();
            if (userFrom.balance.gte(this.amount)) {
                userFrom.incrementNonce();
                userFrom.decrementBalance(this.amount);
                yield this.createSignature(userFrom);
                this.updateStateTree(userFrom);
                this.database.toJson();
            }
            else {
                throw Error("insufficient Balance for withdraw");
            }
        });
    }
    toBytes() {
        let userFrom = this.database.getMemberFromStateId(this.from).user;
        return ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256", "address", "uint256", "uint256", "uint256"], [
            this.from,
            userFrom.address,
            userFrom.balance,
            this.amount,
            userFrom.nonce,
        ]);
    }
    toMessage() {
        return ethers_1.ethers.utils.keccak256(this.toBytes());
    }
}
exports.default = Withdraw;
//# sourceMappingURL=Withdraw.js.map