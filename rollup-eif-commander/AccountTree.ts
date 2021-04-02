import { ethers } from "ethers";

class MerkelTree {
  DEPTH: number;
  leaves: any[];
  rootHash: string;

  constructor(depth: number) {
    this.DEPTH = depth;
    this.leaves = [];
    this.rootHash = "";

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
