// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract AccountTree {
  uint256 public constant DEPTH = 4;
  uint256 internal nextLeafIndex = 0;

  bytes32 public root;

  bytes32[DEPTH] internal zeros;
  bytes32[DEPTH] internal filledSubtrees;

  event LeafInsertion(bytes32 indexed leaf, uint256 indexed leafIndex);

  constructor() {
    bytes32 zeroValue =
      0x0000000000000000000000000000000000000000000000000000000000000000;
    zeros[0] = zeroValue;

    bytes32 currentZero = zeroValue;

    for (uint8 i = 1; i < DEPTH; i++) {
      bytes32 hashed = keccak256(abi.encodePacked(currentZero, currentZero));
      zeros[i] = hashed;
      filledSubtrees[i] = hashed;
      currentZero = hashed;
    }

    root = keccak256(abi.encodePacked(currentZero, currentZero));
  }

  function insertLeaf(bytes32 _leaf) external returns (uint256) {
    uint256 currentIndex = nextLeafIndex;
    bytes32 currentLevelHash = _leaf;
    bytes32 left;
    bytes32 right;

    for (uint8 i = 0; i < DEPTH; i++) {
      if (currentIndex % 2 == 0) {
        left = currentLevelHash;
        right = zeros[i];
      } else {
        left = filledSubtrees[i];
        right = currentLevelHash;
      }
    }

    currentLevelHash = keccak256(abi.encodePacked(left, right));
    currentIndex >>= 1;

    root = currentLevelHash;
    uint256 n = nextLeafIndex;
    nextLeafIndex++;

    emit LeafInsertion(_leaf, n);

    return currentIndex;
  }
}
