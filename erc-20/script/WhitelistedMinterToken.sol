// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "src/WhitelistedMinterERC20.sol";

contract DeployWhitelistedToken is Script {
    function run() external {
        // Retrieve private key as a string
        
        vm.startBroadcast();

        // Deploy the contract
        WhitelistedMintableToken token = new WhitelistedMintableToken(
            "Test Token",
            "TTK"
        );

        console.log("Deployed Token at:", address(token));

        vm.stopBroadcast();
    }
}
