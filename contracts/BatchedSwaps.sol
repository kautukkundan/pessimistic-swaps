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

contract BatchedSwaps {
  address internal dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
  IUniswapV2Router02 internal router =
    IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  struct AccountStateSwap {
    address payable userAddress;
    uint256 balance;
  }

  AccountStateSwap[] public batch;

  receive() external payable {}

  function deposit(uint256 _amount) external {
    IERC20(dai).transferFrom(msg.sender, address(this), _amount);
    AccountStateSwap memory newUser = AccountStateSwap(msg.sender, _amount);
    batch.push(newUser);
  }

  function swap() public {
    performSwap();

    for (uint256 i = 0; i < batch.length; i++) {
      uint256 accountShare = getQuote(batch[i].balance);
      batch[i].userAddress.transfer(accountShare);
      delete batch[i];
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
}
