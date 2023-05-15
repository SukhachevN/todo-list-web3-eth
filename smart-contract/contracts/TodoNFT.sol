//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TodoNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFTData {
        string name;
        string description;
        string image;
    }

    mapping(uint => NFTData) private _idToNFTData;

    constructor() ERC721("TODO NFT", "TODO") {
        _tokenIds.increment();
    }

    function mintNFT(
        address _account,
        string memory _name,
        string memory _description,
        string memory _image
    ) public returns (uint) {
        uint newItemId = _tokenIds.current();

        _idToNFTData[newItemId] = NFTData(_name, _description, _image);

        _safeMint(_account, newItemId);
        _tokenIds.increment();

        return newItemId;
    }

    function tokenURI(
        uint256 _id
    ) public view override returns (string memory) {
        NFTData memory nftData = _idToNFTData[_id];

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                nftData.name,
                '", "description": "',
                nftData.description,
                '", "image": "',
                nftData.image,
                '"}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}
