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

contract Rollup {
  AccountTree public accounts;
  bytes32 public rootL1;

  address internal dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
  IUniswapV2Router02 internal router =
    IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

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
    rootL1 = accounts.rootHash();
  }

  receive() external payable {}

  function deposit(bytes32[] memory _proofs, uint256 _amount) public {
    IERC20(dai).transferFrom(msg.sender, address(this), _amount);
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
}
