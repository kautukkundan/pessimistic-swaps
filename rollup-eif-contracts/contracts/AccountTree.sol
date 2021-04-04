// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "hardhat/console.sol";

contract AccountTree {
  uint256 depth;
  bytes32 public rootHash;
  uint256 nextLeafIndex;

  constructor(uint256 _depth) {
    depth = _depth;
    createRootHash(_depth);
    nextLeafIndex = 0;
  }

  function createRootHash(uint256 _depth) internal {
    bytes32 firstZero =
      0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 hash = firstZero;

    for (uint256 i = 0; i < _depth; i++) {
      hash = keccak256(abi.encode(hash, hash));
    }

    rootHash = hash;
  }

  function insertLeaf(bytes32[] memory _proofs, bytes32 _leaf) external {
    require(nextLeafIndex <= 2**depth, "account tree is full");
    insertLeafAt(_proofs, _leaf, nextLeafIndex);
    nextLeafIndex++;
  }

  function insertLeafAt(
    bytes32[] memory _proofs,
    bytes32 _leaf,
    uint256 index
  ) public {
    bytes32 hash = _leaf;

    console.log("leaf");
    console.logBytes32(_leaf);
    console.logBytes32(_proofs[0]);
    console.logBytes32(_proofs[1]);
    console.logBytes32(_proofs[2]);
    console.logBytes32(_proofs[3]);

    for (uint256 i = 0; i < _proofs.length; i++) {
      bytes32 proofElement = _proofs[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encode(hash, proofElement));
      } else {
        hash = keccak256(abi.encode(proofElement, hash));
      }

      index = index / 2;
    }

    console.log("rootHash");
    console.logBytes32(hash);

    rootHash = hash;
  }
}
