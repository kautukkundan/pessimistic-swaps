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

contract Exchange {
  address dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
  IUniswapV2Router02 router =
    IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  function performSwap(uint256 amountIn) external {
    IERC20(dai).transferFrom(msg.sender, address(this), amountIn);
    IERC20(dai).approve(address(router), amountIn);

    address[] memory path = new address[](2);
    path[0] = dai;
    path[1] = router.WETH();
    router.swapExactTokensForETH(
      amountIn,
      0,
      path,
      msg.sender,
      block.timestamp
    );
  }

  function getQuote(uint256 amountIn) external view returns (uint256) {
    uint256 a;
    uint256 b;
    (a, b) = UniswapV2Library.getReserves(router.factory(), dai, router.WETH());
    return router.getAmountOut(amountIn, a, b);
  }
}
