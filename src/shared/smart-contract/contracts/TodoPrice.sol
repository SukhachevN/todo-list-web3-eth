//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./TodoNFT.sol";

contract TodoPrice is Ownable {
    uint internal _createTodoReward = 50;

    uint internal _completeTodoReward = 100;

    uint internal _aiImageTryPrice = 1000;

    uint internal _mintAiImageNftPrice = 500;

    function setCreateTodoReward(uint reward) public onlyOwner {
        _createTodoReward = reward;
    }

    function setCompleteTodoReward(uint reward) public onlyOwner {
        _completeTodoReward = reward;
    }

    function setAiImageTryPrice(uint price) public onlyOwner {
        _aiImageTryPrice = price;
    }

    function setMintAiImageNFTPrice(uint price) public onlyOwner {
        _mintAiImageNftPrice = price;
    }
}
