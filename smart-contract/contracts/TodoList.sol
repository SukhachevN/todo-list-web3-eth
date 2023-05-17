//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./TodoListBase.sol";
import "./TodoListNFT.sol";
import "./TodoAchievements.sol";
import "./TodoAiImage.sol";

contract TodoList is TodoListBase, TodoListNFT, TodoAchievements, TodoAiImage {
    constructor(address todoNftAddress) {
        todoNFT = TodoNFT(todoNftAddress);
    }
}
