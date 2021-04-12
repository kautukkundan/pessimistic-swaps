// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;
pragma experimental ABIEncoderV2;

import {
  IUniswapV2Router02
} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import {
  UniswapV2Library
} from "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccountTree } from "./AccountTree.sol";
import { RollToken } from "./RollToken.sol";
import { Verifier } from "./Verifier.sol";

import "hardhat/console.sol";

contract Rollup {
  AccountTree public accounts;
  address public underlying;
  bytes32 public rootL1;

  address dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
  IUniswapV2Router02 router =
    IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  struct L2Tx {
    uint256 fromStateId;
    address fromAddress;
    uint256 fromBalance;
    uint256 fromNonce;
    uint256 toStateId;
    address toAddress;
    uint256 toBalance;
    uint256 toNonce;
  }

  struct L2Withdraw {
    uint256 fromStateId;
    address fromAddress;
    uint256 fromBalance;
    uint256 withdrawAmount;
    uint256 fromNonce;
  }

  struct Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  struct AccountState {
    bytes32 leaf;
    bytes32[] siblings;
    uint256 stateId;
  }

  struct AccountStateSwap {
    address payable userAddress;
    uint256 balance;
    uint256 nonce;
    bytes32[] siblings;
    uint256 stateId;
  }

  event AccountRegistered(address user, uint256 amount, uint256 nonce);

  constructor() public {
    accounts = new AccountTree(4);
    RollToken underlyingToken = new RollToken(msg.sender);
    underlying = address(underlyingToken);
    rootL1 = accounts.rootHash();
  }

  function deposit(bytes32[] memory _proofs, uint256 _amount) public {
    IERC20(underlying).transferFrom(msg.sender, address(this), _amount);
    bytes32 leaf = keccak256(abi.encode(msg.sender, _amount, uint256(0)));
    accounts.insertLeaf(_proofs, leaf);
    rootL1 = accounts.rootHash();
    emit AccountRegistered(msg.sender, _amount, 0);
  }

  function swap(bytes[] memory _initialStates) public {
    verifyInitialStateForSwap(_initialStates);
    performSwap();

    AccountStateSwap memory accountStateSwap;

    for (uint256 i = 0; i < _initialStates.length; i++) {
      (accountStateSwap.userAddress, accountStateSwap.balance, , , ) = abi
        .decode(
        _initialStates[i],
        (address, uint256, uint256, bytes32[], uint256)
      );

      uint256 accountShare = getQuote(accountStateSwap.balance);
      accountStateSwap.userAddress.transfer(accountShare);
    }
  }

  function performSwap() public {
    uint256 contractBalance = IERC20(dai).balanceOf(address(this));
    IERC20(dai).approve(address(router), contractBalance);

    address[] memory path = new address[](2);
    path[0] = dai;
    path[1] = router.WETH();
    router.swapExactTokensForETH(
      contractBalance,
      0,
      path,
      address(this),
      block.timestamp
    );
  }

  function getQuote(uint256 amountIn) public view returns (uint256) {
    uint256 a;
    uint256 b;
    (a, b) = UniswapV2Library.getReserves(router.factory(), dai, router.WETH());
    return router.getAmountOut(amountIn, a, b);
  }

  function withdraw(bytes[] memory _transactions, bytes[] memory _initialStates)
    public
  {
    verifyInitialState(_initialStates);

    Signature memory signature;
    bytes memory txData;

    bytes32[] memory siblingsFrom;

    bytes32 rootL2;

    for (uint8 i = 0; i < _transactions.length; i++) {
      (
        signature.v,
        signature.r,
        signature.s,
        txData,
        siblingsFrom,
        rootL2
      ) = abi.decode(
        _transactions[i],
        (uint8, bytes32, bytes32, bytes, bytes32[], bytes32)
      );

      L2Withdraw memory l2Withdraw = decodeL2withdraw(txData);

      //   Verifier verifier = new Verifier();
      //   address signer =
      //     verifier.verifyString(string(keccak256(txData)), v, r, s);
      //   require(signer == l2Tx.fromAddress, "invalid transaction");

      bytes32 leafFrom =
        keccak256(
          abi.encode(
            l2Withdraw.fromAddress,
            l2Withdraw.fromBalance,
            l2Withdraw.fromNonce
          )
        );
      accounts.insertLeafAt(siblingsFrom, leafFrom, l2Withdraw.fromStateId);
      require(rootL2 == accounts.rootHash(), "invalid merkle proof");

      rootL1 = accounts.rootHash();
      IERC20(underlying).transfer(
        l2Withdraw.fromAddress,
        l2Withdraw.withdrawAmount
      );
    }
  }

  function applyTransactions(
    bytes[] memory _transactions,
    bytes[] memory _initialStates
  ) public {
    verifyInitialState(_initialStates);

    Signature memory signature;
    bytes memory txData;

    bytes32[] memory siblingsFrom;
    bytes32[] memory siblingsTo;

    bytes32 rootL2;

    for (uint8 i = 0; i < _transactions.length; i++) {
      (
        signature.v,
        signature.r,
        signature.s,
        txData,
        siblingsFrom,
        siblingsTo,
        rootL2
      ) = abi.decode(
        _transactions[i],
        (uint8, bytes32, bytes32, bytes, bytes32[], bytes32[], bytes32)
      );

      L2Tx memory l2Tx = decodeL2tx(txData);

      //   Verifier verifier = new Verifier();
      //   address signer =
      //     verifier.verifyString(string(keccak256(txData)), v, r, s);
      //   require(signer == l2Tx.fromAddress, "invalid transaction");

      bytes32 leafFrom =
        keccak256(
          abi.encode(l2Tx.fromAddress, l2Tx.fromBalance, l2Tx.fromNonce)
        );
      accounts.insertLeafAt(siblingsFrom, leafFrom, l2Tx.fromStateId);

      bytes32 leafTo =
        keccak256(abi.encode(l2Tx.toAddress, l2Tx.toBalance, l2Tx.toNonce));
      accounts.insertLeafAt(siblingsTo, leafTo, l2Tx.toStateId);

      require(rootL2 == accounts.rootHash(), "invalid merkle proof");
      rootL1 = accounts.rootHash();
    }
  }

  // View Functions
  function getAccountsTree() external view returns (address) {
    return address(accounts);
  }

  function verifyInitialStateForSwap(bytes[] memory _initialStates)
    public
    view
  {
    AccountStateSwap memory accountStateSwap;

    for (uint256 i = 0; i < _initialStates.length; i++) {
      (
        accountStateSwap.userAddress,
        accountStateSwap.balance,
        accountStateSwap.nonce,
        accountStateSwap.siblings,
        accountStateSwap.stateId
      ) = abi.decode(
        _initialStates[i],
        (address, uint256, uint256, bytes32[], uint256)
      );

      bytes32 leaf =
        keccak256(
          abi.encode(
            accountStateSwap.userAddress,
            accountStateSwap.balance,
            accountStateSwap.nonce
          )
        );

      bool isIncluded =
        accounts.verifyInclusion(
          accountStateSwap.siblings,
          leaf,
          accountStateSwap.stateId
        );

      require(isIncluded == true, "invalid initial state");
    }
  }

  function verifyInitialState(bytes[] memory _initialStates) public view {
    AccountState memory accountState;

    for (uint256 i = 0; i < _initialStates.length; i++) {
      accountState = decodeInitialState(_initialStates[i]);
      bool isIncluded =
        accounts.verifyInclusion(
          accountState.siblings,
          accountState.leaf,
          accountState.stateId
        );

      require(isIncluded == true, "invalid initial state");
    }
  }

  // Pure Functions
  function decodeL2withdraw(bytes memory _txData)
    public
    pure
    returns (L2Withdraw memory)
  {
    L2Withdraw memory withdrawInfo;

    (
      withdrawInfo.fromStateId,
      withdrawInfo.fromAddress,
      withdrawInfo.fromBalance,
      withdrawInfo.withdrawAmount,
      withdrawInfo.fromNonce
    ) = abi.decode(_txData, (uint256, address, uint256, uint256, uint256));

    return withdrawInfo;
  }

  function decodeL2tx(bytes memory _txData) public pure returns (L2Tx memory) {
    L2Tx memory txInfo;

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

  function decodeInitialState(bytes memory _initialStateBytes)
    public
    pure
    returns (AccountState memory)
  {
    AccountState memory accountState;

    (accountState.leaf, accountState.siblings, accountState.stateId) = abi
      .decode(_initialStateBytes, (bytes32, bytes32[], uint256));

    return accountState;
  }
}
