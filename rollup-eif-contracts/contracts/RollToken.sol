// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RollToken is ERC20 {
  constructor(address _deployer) ERC20("Roll Token", "RTKO") {
    _mint(_deployer, 100 ether);
  }
}
