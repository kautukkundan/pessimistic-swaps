"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class MerkelTree {
    constructor() {
        this.DEPTH = 4;
        this.nextLeafIndex = 0;
        this.root;
        this.zeros = new Array(this.DEPTH);
        this.filledSubtrees = new Array(this.DEPTH);
        let zeroValue = "0x0000000000000000000000000000000000000000000000000000000000000000";
        this.zeros[0] = zeroValue;
        let currentZero = zeroValue;
        for (let i = 1; i < this.DEPTH; i++) {
            let hashed = this.hashLeftRight(currentZero, currentZero);
            this.zeros[i] = hashed;
            this.filledSubtrees[i] = hashed;
            currentZero = hashed;
        }
        this.root = this.hashLeftRight(currentZero, currentZero);
    }
    insertLeaf(leaf) {
        let currentIndex = this.nextLeafIndex;
        let currentLevelHash = leaf;
        let left;
        let right;
        for (let i = 0; i < this.DEPTH; i++) {
            if (currentIndex % 2 === 0) {
                left = currentLevelHash;
                right = this.zeros[i];
            }
            else {
                left = this.filledSubtrees[i];
                right = currentLevelHash;
            }
        }
        currentLevelHash = this.hashLeftRight(left, right);
        this.root = currentLevelHash;
        this.nextLeafIndex += 1;
    }
    hashLeftRight(left, right) {
        return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [left, right]));
    }
}
exports.default = MerkelTree;
//# sourceMappingURL=AccountTree.js.map