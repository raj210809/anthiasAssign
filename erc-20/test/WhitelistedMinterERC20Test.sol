// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "src/WhitelistedMinterERC20.sol";

contract WhitelistedMinterERC20Test is Test {
    WhitelistedMintableToken token;
    address owner = address(0x123);
    address minter = address(0x456);
    address attacker = address(0x789);

    function setUp() public {
        vm.prank(owner);
        token = new WhitelistedMintableToken("Test Token", "TTK");

        vm.prank(owner);
        token.updateMinter(minter);
    }

    function test_MintByMinter() public {
        vm.prank(minter);
        token.mint(owner, 100);
        assertEq(token.balanceOf(owner), 100);
    }

    function test_RevertWhen_MintByNonMinter() public {
        vm.prank(attacker);
        vm.expectRevert("Not whitelisted minter");
        token.mint(attacker, 100);
    }

    function test_RevertWhen_BurnMoreThanBalance() public {
        vm.prank(minter);
        vm.expectRevert(); 
        token.mint(minter, 100);
        token.burn(101);
    }

    function test_RevertWhen_UpdateMinterByNonOwner() public {
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        token.updateMinter(attacker);
    }

    function testBurn() public {
        vm.prank(minter);
        token.mint(attacker, 1000);

        vm.prank(attacker);
        token.burn(500);
        assertEq(token.balanceOf(attacker), 500);
    }

   function testTransfer() public {
        vm.prank(minter);
        token.mint(minter, 1000);

        vm.prank(minter);
        token.transfer(attacker, 500);

        assertEq(token.balanceOf(minter), 500);
        assertEq(token.balanceOf(attacker), 500); 
    }


    function testUpdateMinterByOwner() public {
        address newMinter = address(0x999);
        vm.prank(owner);
        token.updateMinter(newMinter);

        vm.prank(newMinter);
        token.mint(attacker, 1000);
        assertEq(token.balanceOf(attacker), 1000);
    }
}
