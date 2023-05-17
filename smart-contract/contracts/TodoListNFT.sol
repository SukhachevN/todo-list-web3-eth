//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./TodoNFT.sol";

contract TodoListNFT is Ownable {
    TodoNFT internal todoNFT;

    function setTodoNFTContractAddress(
        address todoNFTAddress
    ) public onlyOwner {
        todoNFT = TodoNFT(todoNFTAddress);
    }
}
