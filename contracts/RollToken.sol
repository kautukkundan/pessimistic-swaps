// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RollToken is ERC20 {
  constructor(address _deployer) public ERC20("Roll Token", "RTKO") {
    _mint(_deployer, 2000 ether);
  }
}
