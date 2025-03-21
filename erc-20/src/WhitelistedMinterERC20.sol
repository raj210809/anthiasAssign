// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WhitelistedMintableToken
 * @dev ERC20 token with a whitelisted minter that can mint unlimited tokens.
 *      Only the contract owner can change the minter.
 */
contract WhitelistedMintableToken is ERC20 , Ownable {
    /// @notice Address allowed to mint tokens
    address public whitelistedMinter;

    /// @notice Event emitted when the whitelisted minter is updated
    event MinterUpdated(address indexed newMinter);

    event Mint(address indexed to, uint256 amount);

    event Burn(address indexed from, uint256 amount);

    /**
     * @dev Sets the deployer as the initial minter and owner.
     * @param name Token name
     * @param symbol Token symbol
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        whitelistedMinter = msg.sender;
    }

    /// @notice Ensures that only the whitelisted minter can perform certain actions
    modifier onlyMinter() {
        require(msg.sender == whitelistedMinter, "WhitelistedMintableToken: Not the whitelisted minter");
        _;
    }

    /**
     * @dev Allows the owner to update the whitelisted minter
     * @param newMinter Address of the new minter
     */
    function updateMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0), "WhitelistedMintableToken: Invalid minter address");
        whitelistedMinter = newMinter;
        emit MinterUpdated(newMinter);
    }

    /**
     * @dev Mints tokens to a specified address. Can only be called by the whitelisted minter.
     * @param to Address to receive the minted tokens
     * @param amount Number of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /**
     * @dev Burns tokens from the sender's balance
     * @param amount Number of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }
}
