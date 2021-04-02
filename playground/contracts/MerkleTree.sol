// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract MerkleProof {
  function verify(
    bytes32[] memory proof,
    bytes32 root,
    bytes32 leaf,
    uint256 index
  ) public pure returns (bool) {
    bytes32 hash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encodePacked(hash, proofElement));
      } else {
        hash = keccak256(abi.encodePacked(proofElement, hash));
      }

      index = index / 2;
    }

    return hash == root;
  }
}

contract Tree {
  uint256 public constant DEPTH = 10;
  bytes32[DEPTH] public leaves;

  uint256 public lastIndex = 0;
  bytes32 rootHash;

  function appendToTree(address _account, uint256 _amount) external {
    require(lastIndex < DEPTH, "tree is full");
    bytes32 proof = keccak256(abi.encodePacked(_account, _amount));
    leaves[lastIndex] = proof;
    lastIndex++;
  }

  function getRootHash() external view returns (bytes32) {
    bytes32 hash = leaves[0];
    uint256 index = 0;

    for (uint256 i = 0; i < leaves.length; i++) {
      bytes32 proofElement = leaves[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encodePacked(hash, proofElement));
      } else {
        hash = keccak256(abi.encodePacked(proofElement, hash));
      }

      index = index / 2;
    }

    return hash;
  }
}
