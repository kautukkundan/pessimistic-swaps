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
const Actions_1 = __importDefault(require("./Actions"));
let makeTransfer = () => __awaiter(void 0, void 0, void 0, function* () {
    let actions = new Actions_1.default();
    yield actions.loadDb();
    yield actions.loadTree();
    let tx = yield actions.transferTokens(0, 1, ethers_1.ethers.BigNumber.from("2"));
    console.log({
        signature: tx.signature,
        message: tx.toMessage(),
        bytes: tx.toBytes(),
        userFrom: {
            userFrom: tx.getUserFrom(),
            stateId: tx.from,
            siblings: tx.siblingsFrom,
        },
        userTo: {
            userTo: tx.getUserTo(),
            stateId: tx.to,
            siblings: tx.siblingsTo,
        },
    });
    let tx2 = yield actions.transferTokens(0, 1, ethers_1.ethers.BigNumber.from("5"));
    console.log({
        signature: tx2.signature,
        message: tx2.toMessage(),
        bytes: tx2.toBytes(),
        userFrom: {
            userFrom: tx2.getUserFrom(),
            stateId: tx2.from,
            siblings: tx2.siblingsFrom,
        },
        userTo: {
            userTo: tx2.getUserTo(),
            stateId: tx2.to,
            siblings: tx2.siblingsTo,
        },
    });
    let tx3 = yield actions.transferTokens(2, 0, ethers_1.ethers.BigNumber.from("7"));
    console.log({
        signature: tx3.signature,
        message: tx3.toMessage(),
        bytes: tx3.toBytes(),
        userFrom: {
            userFrom: tx3.getUserFrom(),
            stateId: tx3.from,
            siblings: tx3.siblingsFrom,
        },
        userTo: {
            userTo: tx3.getUserTo(),
            stateId: tx3.to,
            siblings: tx3.siblingsTo,
        },
    });
    let tx4 = yield actions.transferTokens(0, 3, ethers_1.ethers.BigNumber.from("6"));
    console.log({
        signature: tx4.signature,
        message: tx4.toMessage(),
        bytes: tx4.toBytes(),
        userFrom: {
            userFrom: tx4.getUserFrom(),
            stateId: tx4.from,
            siblings: tx4.siblingsFrom,
        },
        userTo: {
            userTo: tx4.getUserTo(),
            stateId: tx4.to,
            siblings: tx4.siblingsTo,
        },
    });
});
makeTransfer();
//# sourceMappingURL=makeTransfer.js.map