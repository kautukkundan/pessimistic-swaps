// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccountTree } from "./AccountTree.sol";
import { RollToken } from "./RollToken.sol";

contract Rollup {
  AccountTree public accounts;
  address public underlying;

  event AccountRegistered(address user, uint256 amount, uint256 nonce);

  constructor() {
    accounts = new AccountTree();
    RollToken underlyingToken = new RollToken(msg.sender);
    underlying = address(underlyingToken);
  }

  function deposit(uint256 _amount) external {
    IERC20(underlying).transferFrom(msg.sender, address(this), _amount);
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount, uint256(0)));
    accounts.insertLeaf(leaf);
    emit AccountRegistered(msg.sender, _amount, 0);
  }

  // View Functions
  function getAccountsTree() external view returns (address) {
    return address(accounts);
  }
}