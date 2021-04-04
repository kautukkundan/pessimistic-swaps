// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccountTree } from "./AccountTree.sol";
import { RollToken } from "./RollToken.sol";
import { Verifier } from "./Verifier.sol";

import "hardhat/console.sol";

contract Rollup {
  AccountTree public accounts;
  address public underlying;
  bytes32 public merkleRoot;

  struct TxInfo {
    uint256 fromStateId;
    address fromAddress;
    uint256 fromBalance;
    uint256 fromNonce;
    uint256 toStateId;
    address toAddress;
    uint256 toBalance;
    uint256 toNonce;
  }

  event AccountRegistered(address user, uint256 amount, uint256 nonce);
  event BatchUpdate();

  constructor() {
    accounts = new AccountTree(4);
    RollToken underlyingToken = new RollToken(msg.sender);
    underlying = address(underlyingToken);
    merkleRoot = accounts.rootHash();
  }

  function deposit(bytes32[] memory _proofs, uint256 _amount) external {
    IERC20(underlying).transferFrom(msg.sender, address(this), _amount);
    bytes32 leaf = keccak256(abi.encode(msg.sender, _amount, uint256(0)));

    console.log(msg.sender, _amount, uint256(0));

    accounts.insertLeaf(_proofs, leaf);
    merkleRoot = accounts.rootHash();
    emit AccountRegistered(msg.sender, _amount, 0);
  }

  function generateTransactions(bytes[] calldata transactions) external {
    uint8 v;
    bytes32 r;
    bytes32 s;

    bytes memory txData;

    bytes32[] memory siblingsFrom;
    bytes32[] memory siblingsTo;

    bytes32 rootHash;

    for (uint8 i = 0; i < transactions.length; i++) {
      (v, r, s, txData, siblingsFrom, siblingsTo, rootHash) = abi.decode(
        transactions[i],
        (uint8, bytes32, bytes32, bytes, bytes32[], bytes32[], bytes32)
      );

      TxInfo memory txInfo = getDetailsFromTxData(txData);

      //   Verifier verifier = new Verifier();
      //   address signer =
      //     verifier.verifyString(string(keccak256(txData)), v, r, s);
      //   require(signer == txInfo.fromAddress, "invalid transaction");

      bytes32 leafFrom =
        keccak256(
          abi.encode(txInfo.fromAddress, txInfo.fromBalance, txInfo.fromNonce)
        );
      accounts.insertLeafAt(siblingsFrom, leafFrom, txInfo.fromStateId);

      bytes32 leafTo =
        keccak256(
          abi.encode(txInfo.toAddress, txInfo.toBalance, txInfo.toNonce)
        );
      accounts.insertLeafAt(siblingsTo, leafTo, txInfo.toStateId);

      require(rootHash == accounts.rootHash(), "invalid merkle proof");
      merkleRoot = accounts.rootHash();
    }
  }

  // View Functions
  function getAccountsTree() external view returns (address) {
    return address(accounts);
  }

  // Pure Functions
  function getDetailsFromTxData(bytes memory _txData)
    public
    pure
    returns (TxInfo memory)
  {
    TxInfo memory txInfo;

    (
      txInfo.fromStateId,
      txInfo.fromAddress,
      txInfo.fromBalance,
      txInfo.fromNonce,
      txInfo.toStateId,
      txInfo.toAddress,
      txInfo.toBalance,
      txInfo.toNonce
    ) = abi.decode(
      _txData,
      (uint256, address, uint256, uint256, uint256, address, uint256, uint256)
    );

    return txInfo;
  }
}
