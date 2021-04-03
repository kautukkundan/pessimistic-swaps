"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class MerkelTree {
    constructor(depth) {
        this.DEPTH = depth;
        this.leaves = [];
        this.rootHash = "";
        this.nextLeafIndex = 0;
        this.zeros = new Array(this.DEPTH);
        this.filledSubtrees = new Array(this.DEPTH);
        this.rootHistory = new Map();
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
        this.nextLeafIndex += 1;
        console.log("new leaf added: ", leaf);
    }
    insertAt(proof, leaf, index) {
        let hash = leaf;
        this.tree[this.DEPTH][index] = leaf;
        for (let i = 0; i < proof.length; i++) {
            let proofElement = proof[i];
            if (index % 2 == 0) {
                hash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [hash, proofElement]));
            }
            else {
                hash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [proofElement, hash]));
            }
            index = Math.floor(index / 2);
            this.tree[this.DEPTH][index] = hash;
        }
        this.rootHash = hash;
    }
}
exports.default = MerkelTree;
//# sourceMappingURL=AccountTree.js.map