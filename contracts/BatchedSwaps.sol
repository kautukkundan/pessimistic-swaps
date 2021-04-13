// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;
pragma experimental ABIEncoderV2;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Exchange } from "./Exchange.sol";

contract BatchedSwaps {
  struct AccountStateSwap {
    address payable userAddress;
    uint256 balance;
  }

  Exchange internal exchange = new Exchange();

  AccountStateSwap[] public batch;

  receive() external payable {}

  function deposit(uint256 _amount) external {
    IERC20(exchange.dai()).transferFrom(msg.sender, address(this), _amount);
    AccountStateSwap memory newUser = AccountStateSwap(msg.sender, _amount);
    batch.push(newUser);
  }

  function swap() public {
    uint256 contractBalance = IERC20(exchange.dai()).balanceOf(address(this));
    IERC20(exchange.dai()).approve(address(exchange), contractBalance);
    exchange.performSwap(contractBalance);

    for (uint256 i = 0; i < batch.length; i++) {
      uint256 accountShare = exchange.getQuote(batch[i].balance);
      batch[i].userAddress.transfer(accountShare);
      //   delete batch[i];
    }
  }
}
