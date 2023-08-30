//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./TodoListBase.sol";
import "./TodoListNFT.sol";

contract TodoAiImage is TodoListBase, TodoListNFT {
    event NewAiImageNFT(
        address indexed _creator,
        uint _nftId,
        string name,
        string description,
        string image
    );

    struct AiImageState {
        bool isInitialized;
        uint tryCount;
    }

    struct SavedAiImage {
        string name;
        string description;
        string image;
        uint nftId;
    }

    struct SaveAiImageArgs {
        string name;
        string description;
        string image;
    }

    mapping(address => AiImageState) private _userToAiImageState;

    mapping(address => SavedAiImage) private _userToSavedAiImage;

    function getAiImageState() public view returns (AiImageState memory) {
        return _userToAiImageState[msg.sender];
    }

    function initializeAiImageState() public {
        Stats memory stats = _userToStats[msg.sender];

        require(
            stats.created > 0,
            "Need create at least one todo to get free try"
        );

        AiImageState storage aiImageState = _userToAiImageState[msg.sender];

        aiImageState.isInitialized = true;
        aiImageState.tryCount = 1;
    }

    function buyAiImageTry(uint amount) public {
        require(amount > 0, "Cant buy zero tries");

        // For testing
        // uint priceToPay = 0;
        // For prod
        uint priceToPay = amount * _aiImageTryPrice;
        uint balance = balanceOf(msg.sender);

        require(balance >= priceToPay, "Not enough tokens to buy tries");

        AiImageState storage aiImageState = _userToAiImageState[msg.sender];

        aiImageState.tryCount += amount;

        burn(msg.sender, priceToPay);
    }

    function useAiImageTry() public {
        AiImageState storage aiImageState = _userToAiImageState[msg.sender];

        require(aiImageState.tryCount > 0, "Dont have any tries");

        aiImageState.tryCount--;
    }

    function saveAiImage(SaveAiImageArgs memory _args) public {
        SavedAiImage storage savedAiImage = _userToSavedAiImage[msg.sender];

        savedAiImage.name = _args.name;
        savedAiImage.description = _args.description;
        savedAiImage.image = _args.image;
    }

    function getSavedAiImage() public view returns (SavedAiImage memory) {
        return _userToSavedAiImage[msg.sender];
    }

    function mintAiImageNFT(SaveAiImageArgs memory _args) public {
        uint balance = balanceOf(msg.sender);

        // Comment for testing
        require(
            balance >= _mintAiImageNftPrice,
            "Not enough tokens to mint NFT"
        );
        // Comment for testing
        _burn(msg.sender, _mintAiImageNftPrice);

        uint nftId = todoNFT.mintNFT(
            msg.sender,
            _args.name,
            _args.description,
            _args.image
        );

        SavedAiImage storage savedAiImage = _userToSavedAiImage[msg.sender];

        savedAiImage.name = _args.name;
        savedAiImage.description = _args.description;
        savedAiImage.image = _args.image;
        savedAiImage.nftId = nftId;

        emit NewAiImageNFT(
            msg.sender,
            nftId,
            _args.name,
            _args.description,
            _args.image
        );
    }
}
