//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TodoToken is ERC20 {
    constructor() ERC20("TODO", "TODO") {}

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(address account, uint amount) internal {
        _mint(account, amount);
    }

    function burn(address account, uint amount) internal {
        _burn(account, amount);
    }
}
