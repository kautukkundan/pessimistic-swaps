import { ethers } from "ethers";

class MerkelTree {
  DEPTH: number;
  leaves: any[];
  root: string;
  nextLeafIndex: number;
  zeros: string[];
  filledSubtrees: string[];
  rootHistory: Map<string, boolean>;

  constructor() {
    this.DEPTH = 4;
    this.nextLeafIndex = 0;

    this.root;

    this.zeros = new Array<string>(this.DEPTH);
    this.filledSubtrees = new Array<string>(this.DEPTH);

    let zeroValue: string =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    this.zeros[0] = zeroValue;

    let currentZero: string = zeroValue;

    for (let i = 1; i < this.DEPTH; i++) {
      let hashed = this.hashLeftRight(currentZero, currentZero);
      this.zeros[i] = hashed;
      this.filledSubtrees[i] = hashed;
      currentZero = hashed;
    }

    this.root = this.hashLeftRight(currentZero, currentZero);
  }

  insertLeaf(leaf: string) {
    let currentIndex = this.nextLeafIndex;
    let currentLevelHash = leaf;
    let left: string;
    let right: string;

    for (let i = 0; i < this.DEPTH; i++) {
      if (currentIndex % 2 === 0) {
        left = currentLevelHash;
        right = this.zeros[i];
      } else {
        left = this.filledSubtrees[i];
        right = currentLevelHash;
      }
    }

    currentLevelHash = this.hashLeftRight(left, right);

    this.root = currentLevelHash;
    this.nextLeafIndex += 1;
  }

  hashLeftRight(left: string, right: string): string {
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [left, right])
    );
  }
}

export default MerkelTree;
