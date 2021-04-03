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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
var fs = require("fs");
const path = require("path");
let filename = path.join(__dirname, "accounttree.json");
class MerkelTree {
    constructor(depth) {
        this.DEPTH = depth;
        this.leaves = [];
        this.rootHash = "";
        this.nextLeafIndex = 0;
        this.tree = [];
        this.createTree();
    }
    createTree() {
        for (let level = 0; level < Math.pow(2, this.DEPTH); level++) {
            this.leaves.push("0x0000000000000000000000000000000000000000000000000000000000000000");
        }
        let currentLevel = this.leaves;
        while (currentLevel.length > 1) {
            let temp = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                let hash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [currentLevel[i], currentLevel[i + 1]]));
                temp.push(hash);
            }
            this.tree.push(currentLevel);
            currentLevel = temp;
        }
        this.tree.push(currentLevel);
        this.rootHash = currentLevel[0];
    }
    getSiblings(index) {
        let proofs = [];
        for (let i = 0; i < this.DEPTH; i++) {
            if (index % 2 == 0) {
                proofs.push(this.tree[i][index + 1]);
            }
            else {
                proofs.push(this.tree[i][index - 1]);
            }
            index = Math.floor(index / 2);
        }
        return proofs;
    }
    insertLeaf(proofs, leaf) {
        this.insertAt(proofs, leaf, this.nextLeafIndex);
        console.log("new leaf added: ", leaf);
    }
    insertAt(proof, leaf, index) {
        let hash = leaf;
        this.tree[0][index] = leaf;
        for (let i = 0; i < proof.length; i++) {
            let proofElement = proof[i];
            if (index % 2 == 0) {
                hash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [hash, proofElement]));
            }
            else {
                hash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [proofElement, hash]));
            }
            index = Math.floor(index / 2);
            this.tree[i + 1][index] = hash;
        }
        this.rootHash = hash;
        this.nextLeafIndex += 1;
        this.toJson();
    }
    toJson() {
        let dataJson = JSON.stringify({
            tree: this.tree,
            next: this.nextLeafIndex,
            rootHash: this.rootHash,
            depth: this.DEPTH,
        }, null, 4);
        fs.writeFile(filename, dataJson, "utf8", () => {
            console.log("saved tree");
        });
    }
    fromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonString = yield fs.readFileSync(filename, "utf8");
            let flattened = JSON.parse(jsonString);
            this.tree = flattened.tree;
            this.nextLeafIndex = flattened.next;
            this.rootHash = flattened.rootHash;
            this.DEPTH = flattened.depth;
        });
    }
}
exports.default = MerkelTree;
//# sourceMappingURL=AccountTree.js.map