import { ethers } from "ethers";

class MerkelTree {
  DEPTH: number;
  leaves: any[];
  rootHash: string;
  nextLeafIndex: number;

  zeros: string[];
  filledSubtrees: string[];
  rootHistory: Map<string, boolean>;

  constructor() {
    this.DEPTH = 4;
    this.leaves = [];
    this.rootHash = "";
    this.nextLeafIndex = 0;
    this.zeros = new Array<string>(this.DEPTH);
    this.filledSubtrees = new Array<string>(this.DEPTH);
    this.rootHistory = new Map();

    this.createTree(
      this.DEPTH,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  }

  createTree(_treeLevels: number, _zeroValue: string) {
    let treeLevels = _treeLevels;

    this.zeros[0] = _zeroValue;

    let currentZero = _zeroValue;
    for (let i = 1; i < treeLevels; i++) {
      let hashed = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32"],
          [currentZero, currentZero]
        )
      );

      this.zeros[i] = hashed;
      this.filledSubtrees[i] = hashed;
      currentZero = hashed;
    }

    this.rootHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "bytes32"],
        [currentZero, currentZero]
      )
    );
  }

  insertLeaf(leaf: string) {
    let currentIndex = this.nextLeafIndex;
    let currentLevelHash = leaf;
    let left;
    let right;

    console.log(this.zeros, this.filledSubtrees);

    for (let i = 0; i < this.DEPTH; i++) {
      if (currentIndex % 2 === 0) {
        left = currentLevelHash;
        right = this.zeros[i];

        this.filledSubtrees[i] = currentLevelHash;
      } else {
        left = this.filledSubtrees[i];
        right = currentLevelHash;
      }

      currentLevelHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32"],
          [left, right]
        )
      );

      currentIndex = Math.floor(currentIndex / 2);
    }

    this.rootHash = currentLevelHash;
    this.rootHistory.set(this.rootHash, true);

    this.nextLeafIndex += 1;

    return currentIndex;
  }
}

export default MerkelTree;
