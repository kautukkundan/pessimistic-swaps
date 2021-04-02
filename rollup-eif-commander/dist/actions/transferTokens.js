"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(require("../entities/Transaction"));
let transferTokens = (to, from, amount, senderNonce) => {
    let tx = new Transaction_1.default(to, from, amount, senderNonce);
    //   tx.execute();
};
exports.default = transferTokens;
//# sourceMappingURL=transferTokens.js.map