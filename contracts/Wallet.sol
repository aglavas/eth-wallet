// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Wallet {
  address payable public owner;

  constructor(address payable ownerAddress) {
    owner = ownerAddress;
  }

  function fund() payable public {
  }

  function send(address payable to, uint amount) public {
    if (msg.sender == owner) {
      to.transfer(amount);
      return;
    }
    revert("Only owner can send money");
  }

  function balanceOf() view public returns(uint) {
    return address(this).balance;
  }
}
