// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract AccountTree {
  uint256 internal depth;
  bytes32 public rootHash;
  uint256 internal nextLeafIndex;

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

    for (uint256 i = 0; i < _proofs.length; i++) {
      bytes32 proofElement = _proofs[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encode(hash, proofElement));
      } else {
        hash = keccak256(abi.encode(proofElement, hash));
      }

      index = index / 2;
    }

    rootHash = hash;
  }

  // View Functions
  function verifyInclusion(
    bytes32[] memory _proofs,
    bytes32 _leaf,
    uint256 index
  ) external view returns (bool isIncluded) {
    bytes32 hash = _leaf;

    for (uint256 i = 0; i < _proofs.length; i++) {
      bytes32 proofElement = _proofs[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encode(hash, proofElement));
      } else {
        hash = keccak256(abi.encode(proofElement, hash));
      }

      index = index / 2;
    }

    return rootHash == hash;
  }
}
