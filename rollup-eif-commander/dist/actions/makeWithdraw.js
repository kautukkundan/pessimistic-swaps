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
let makeWithdraw = () => __awaiter(void 0, void 0, void 0, function* () {
    let actions = new Actions_1.default();
    yield actions.loadDb();
    yield actions.loadTree();
    let initialState = [];
    for (let i = 0; i <= actions.accountTree.nextLeafIndex; i++) {
        let leaf = actions.accountTree.tree[0][i];
        let siblings = actions.accountTree.getSiblings(i);
        let stateId = i;
        let bytes = ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32[]", "uint256"], [leaf, siblings, stateId]);
        initialState.push(bytes);
    }
    let withdrawEvent = (from, amount) => __awaiter(void 0, void 0, void 0, function* () {
        let tx = yield actions.withdrawTokens(from, ethers_1.ethers.BigNumber.from(amount));
        let sig = ethers_1.ethers.utils.splitSignature(tx.signature);
        let bytes = ethers_1.ethers.utils.defaultAbiCoder.encode(["uint8", "bytes32", "bytes32", "bytes", "bytes32[]", "bytes32"], [
            sig.v,
            sig.r,
            sig.s,
            tx.toBytes(),
            tx.siblingsFrom,
            tx.accountTree.rootHash,
        ]);
        return bytes;
    });
    let txData = [];
    txData.push(yield withdrawEvent(0, 10));
    console.log(initialState);
    console.log(txData);
});
makeWithdraw();
//# sourceMappingURL=makeWithdraw.js.map