// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/SkillToken.sol";

contract SkillTokenTest is Test {
    SkillToken public skillToken;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        skillToken = new SkillToken();
        
        // Give users some ETH for testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testMintSkill() public {
        vm.startPrank(user1);
        
        uint256 tokenId = skillToken.mintSkill("JavaScript Development", "ipfs://test-metadata-uri");
        
        assertEq(skillToken.ownerOf(tokenId), user1);
        assertEq(skillToken.tokenURI(tokenId), "ipfs://test-metadata-uri");
        
        SkillToken.Skill memory skill = skillToken.getSkill(tokenId);
        assertEq(skill.skillName, "JavaScript Development");
        assertEq(skill.creator, user1);
        assertEq(skill.isForSale, false);
        
        vm.stopPrank();
    }

    function testMintSkillEmptyName() public {
        vm.startPrank(user1);
        
        vm.expectRevert("Skill name cannot be empty");
        skillToken.mintSkill("", "ipfs://test-metadata-uri");
        
        vm.stopPrank();
    }

    function testMintSkillEmptyURI() public {
        vm.startPrank(user1);
        
        vm.expectRevert("Metadata URI cannot be empty");
        skillToken.mintSkill("JavaScript Development", "");
        
        vm.stopPrank();
    }

    function testListSkillForSale() public {
        vm.startPrank(user1);
        
        uint256 tokenId = skillToken.mintSkill("React Development", "ipfs://react-metadata");
        skillToken.listSkillForSale(tokenId, 1 ether);
        
        SkillToken.Skill memory skill = skillToken.getSkill(tokenId);
        assertEq(skill.isForSale, true);
        assertEq(skill.price, 1 ether);
        
        vm.stopPrank();
    }

    function testListSkillForSaleNotOwner() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("React Development", "ipfs://react-metadata");
        vm.stopPrank();
        
        vm.startPrank(user2);
        vm.expectRevert("Not approved or owner");
        skillToken.listSkillForSale(tokenId, 1 ether);
        vm.stopPrank();
    }

    function testListSkillForSaleZeroPrice() public {
        vm.startPrank(user1);
        
        uint256 tokenId = skillToken.mintSkill("React Development", "ipfs://react-metadata");
        
        vm.expectRevert("Price must be greater than 0");
        skillToken.listSkillForSale(tokenId, 0);
        
        vm.stopPrank();
    }

    function testBuySkill() public {
        // User1 mints and lists a skill
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("Solidity Development", "ipfs://solidity-metadata");
        skillToken.listSkillForSale(tokenId, 2 ether);
        vm.stopPrank();
        
        // User2 buys the skill
        vm.startPrank(user2);
        uint256 balanceBefore = user1.balance;
        
        skillToken.buySkill{value: 2 ether}(tokenId);
        
        assertEq(skillToken.ownerOf(tokenId), user2);
        assertEq(user1.balance, balanceBefore + 2 ether);
        
        SkillToken.Skill memory skill = skillToken.getSkill(tokenId);
        assertEq(skill.isForSale, false);
        assertEq(skill.price, 0);
        
        vm.stopPrank();
    }

    function testBuySkillInsufficientPayment() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("Python Development", "ipfs://python-metadata");
        skillToken.listSkillForSale(tokenId, 2 ether);
        vm.stopPrank();
        
        vm.startPrank(user2);
        vm.expectRevert("Insufficient payment");
        skillToken.buySkill{value: 1 ether}(tokenId);
        vm.stopPrank();
    }

    function testBuySkillNotForSale() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("Go Development", "ipfs://go-metadata");
        vm.stopPrank();
        
        vm.startPrank(user2);
        vm.expectRevert("Skill not for sale");
        skillToken.buySkill{value: 1 ether}(tokenId);
        vm.stopPrank();
    }

    function testBuyOwnSkill() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("Rust Development", "ipfs://rust-metadata");
        skillToken.listSkillForSale(tokenId, 1 ether);
        
        vm.expectRevert("Cannot buy your own skill");
        skillToken.buySkill{value: 1 ether}(tokenId);
        vm.stopPrank();
    }

    function testTransferSkill() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("TypeScript Development", "ipfs://typescript-metadata");
        skillToken.transferSkill(user2, tokenId);
        
        assertEq(skillToken.ownerOf(tokenId), user2);
        vm.stopPrank();
    }

    function testRemoveFromSale() public {
        vm.startPrank(user1);
        uint256 tokenId = skillToken.mintSkill("Vue.js Development", "ipfs://vue-metadata");
        skillToken.listSkillForSale(tokenId, 1 ether);
        
        skillToken.removeFromSale(tokenId);
        
        SkillToken.Skill memory skill = skillToken.getSkill(tokenId);
        assertEq(skill.isForSale, false);
        assertEq(skill.price, 0);
        
        vm.stopPrank();
    }

    function testGetSkillsForSale() public {
        vm.startPrank(user1);
        uint256 tokenId1 = skillToken.mintSkill("Angular Development", "ipfs://angular-metadata");
        uint256 tokenId2 = skillToken.mintSkill("Node.js Development", "ipfs://nodejs-metadata");
        
        skillToken.listSkillForSale(tokenId1, 1 ether);
        skillToken.listSkillForSale(tokenId2, 2 ether);
        vm.stopPrank();
        
        uint256[] memory forSale = skillToken.getSkillsForSale();
        assertEq(forSale.length, 2);
        assertEq(forSale[0], tokenId1);
        assertEq(forSale[1], tokenId2);
    }

    function testGetUserSkills() public {
        vm.startPrank(user1);
        uint256 tokenId1 = skillToken.mintSkill("Docker", "ipfs://docker-metadata");
        uint256 tokenId2 = skillToken.mintSkill("Kubernetes", "ipfs://k8s-metadata");
        vm.stopPrank();
        
        uint256[] memory userSkills = skillToken.getUserSkills(user1);
        assertEq(userSkills.length, 2);
        assertEq(userSkills[0], tokenId1);
        assertEq(userSkills[1], tokenId2);
    }
}
