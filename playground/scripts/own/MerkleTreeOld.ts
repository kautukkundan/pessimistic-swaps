import { ethers } from "ethers";

class MerkelTree {
  DEPTH: number;
  leaves: any[];
  rootHash: string;
  nextLeafIndex: number;

  zeros: number[];
  filledSubtrees: number[];
  rootHistory: Map<number, boolean>;

  constructor() {
    this.DEPTH = 4;
    this.leaves = [];
    this.rootHash = "";
    this.nextLeafIndex = 0;
    this.zeros = new Array<number>(this.DEPTH);
    this.filledSubtrees = new Array<number>(this.DEPTH);
    this.rootHistory = new Map();

    this.createTree();
  }

  createTree() {
    let firstZero =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    let hash = firstZero;

    for (let i = 0; i < this.DEPTH; i++) {
      hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32"],
          [hash, hash]
        )
      );
    }
    this.rootHash = hash;

    // for (let level = 0; level < 2 ** this.DEPTH; level++) {
    //   this.leaves.push(
    //     "0x0000000000000000000000000000000000000000000000000000000000000000"
    //   );
    // }
    // let currentLevel = this.leaves;
    // console.log(currentLevel);
    // while (currentLevel.length > 1) {
    //   let temp = [];
    //   for (let i = 0; i < currentLevel.length; i += 2) {
    //     let hash = ethers.utils.keccak256(
    //       ethers.utils.defaultAbiCoder.encode(
    //         ["bytes32", "bytes32"],
    //         [currentLevel[i], currentLevel[i + 1]]
    //       )
    //     );
    //     temp.push(hash);
    //   }
    //   currentLevel = temp;
    //   console.log(temp);
    // }
    // this.rootHash = currentLevel[0];
  }

  displayTreeFromData(treeData: string[]) {
    this.leaves = treeData;
    console.log(this.leaves);

    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      let temp = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        let hash = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "bytes32"],
            [currentLevel[i], currentLevel[i + 1]]
          )
        );
        temp.push(hash);
      }
      currentLevel = temp;
      console.log(temp);
    }
  }

  insertAt(proof: string[], leaf: string, index: number) {
    console.log(`\n"${leaf}" inserted at index: "${index}"`);
    let hash = leaf;

    for (let i = 0; i < proof.length; i++) {
      let proofElement = proof[i];

      if (index % 2 == 0) {
        hash = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "bytes32"],
            [hash, proofElement]
          )
        );
      } else {
        hash = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "bytes32"],
            [proofElement, hash]
          )
        );
      }

      index = Math.floor(index / 2);
    }

    console.log(`new root hash : "${hash}"`);

    this.rootHash = hash;
  }
}

export default MerkelTree;
