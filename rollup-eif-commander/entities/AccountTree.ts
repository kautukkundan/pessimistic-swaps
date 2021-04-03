import { ethers } from "ethers";
var fs = require("fs");
const path = require("path");
let filename = path.join(__dirname, "accounttree.json");
class MerkelTree {
  DEPTH: number;
  leaves: string[];
  rootHash: string;
  nextLeafIndex: number;
  tree: string[][];

  constructor(depth: number) {
    this.DEPTH = depth;
    this.leaves = [];
    this.rootHash = "";
    this.nextLeafIndex = 0;
    this.tree = [];

    this.createTree();
  }

  createTree() {
    for (let level = 0; level < 2 ** this.DEPTH; level++) {
      this.leaves.push(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    }
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
      this.tree.push(currentLevel);
      currentLevel = temp;
    }
    this.tree.push(currentLevel);
    this.rootHash = currentLevel[0];
  }

  getSiblings(index: number) {
    let proofs: string[] = [];

    for (let i = 0; i < this.DEPTH; i++) {
      if (index % 2 == 0) {
        proofs.push(this.tree[i][index + 1]);
      } else {
        proofs.push(this.tree[i][index - 1]);
      }

      index = Math.floor(index / 2);
    }

    return proofs;
  }

  insertLeaf(proofs: string[], leaf: string) {
    this.insertAt(proofs, leaf, this.nextLeafIndex);
    console.log("new leaf added: ", leaf);
    this.nextLeafIndex += 1;
  }

  insertAt(proof: string[], leaf: string, index: number) {
    let hash = leaf;
    this.tree[0][index] = leaf;

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
      this.tree[i + 1][index] = hash;
    }

    this.rootHash = hash;
    this.toJson();
  }

  toJson() {
    let dataJson = JSON.stringify(
      {
        tree: this.tree,
        next: this.nextLeafIndex,
        rootHash: this.rootHash,
        depth: this.DEPTH,
      },
      null,
      4
    );
    fs.writeFile(filename, dataJson, "utf8", () => {
      console.log("saved tree");
    });
  }

  async fromJson() {
    let jsonString = await fs.readFileSync(filename, "utf8");
    let flattened = JSON.parse(jsonString);

    this.tree = flattened.tree;
    this.nextLeafIndex = flattened.next;
    this.rootHash = flattened.rootHash;
    this.DEPTH = flattened.depth;
  }
}

export default MerkelTree;
