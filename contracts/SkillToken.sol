// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SkillToken is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Skill {
        uint256 tokenId;
        string skillName;
        address creator;
        uint256 price;
        bool isForSale;
        uint256 createdAt;
    }

    mapping(uint256 => Skill) public skills;
    mapping(address => uint256[]) public userSkills;
    uint256[] public allSkills;

    // Events
    event SkillMinted(uint256 indexed tokenId, string skillName, address indexed creator, string metadataURI);
    event SkillTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event SkillListedForSale(uint256 indexed tokenId, uint256 price);
    event SkillSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event SkillRemovedFromSale(uint256 indexed tokenId);

    constructor() ERC721("SkillToken", "SKILL") {}

    function mintSkill(
        string memory skillName,
        string memory metadataURI
    ) public returns (uint256) {
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        skills[tokenId] = Skill({
            tokenId: tokenId,
            skillName: skillName,
            creator: msg.sender,
            price: 0,
            isForSale: false,
            createdAt: block.timestamp
        });

        userSkills[msg.sender].push(tokenId);
        allSkills.push(tokenId);

        emit SkillMinted(tokenId, skillName, msg.sender, metadataURI);
        return tokenId;
    }

    function transferSkill(address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        require(to != address(0), "Cannot transfer to zero address");

        // Remove from sale if listed
        if (skills[tokenId].isForSale) {
            skills[tokenId].isForSale = false;
            skills[tokenId].price = 0;
            emit SkillRemovedFromSale(tokenId);
        }

        // Update user skills mapping
        _removeFromUserSkills(ownerOf(tokenId), tokenId);
        userSkills[to].push(tokenId);

        _transfer(ownerOf(tokenId), to, tokenId);
        emit SkillTransferred(tokenId, msg.sender, to);
    }

    function listSkillForSale(uint256 tokenId, uint256 price) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        require(price > 0, "Price must be greater than 0");
        require(!skills[tokenId].isForSale, "Skill already listed for sale");

        skills[tokenId].isForSale = true;
        skills[tokenId].price = price;

        emit SkillListedForSale(tokenId, price);
    }

    function removeFromSale(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        require(skills[tokenId].isForSale, "Skill not for sale");

        skills[tokenId].isForSale = false;
        skills[tokenId].price = 0;

        emit SkillRemovedFromSale(tokenId);
    }

    function buySkill(uint256 tokenId) public payable nonReentrant {
        require(skills[tokenId].isForSale, "Skill not for sale");
        require(msg.value >= skills[tokenId].price, "Insufficient payment");
        require(msg.sender != ownerOf(tokenId), "Cannot buy your own skill");

        address seller = ownerOf(tokenId);
        uint256 price = skills[tokenId].price;

        // Remove from sale
        skills[tokenId].isForSale = false;
        skills[tokenId].price = 0;

        // Update user skills mapping
        _removeFromUserSkills(seller, tokenId);
        userSkills[msg.sender].push(tokenId);

        // Transfer the NFT
        _transfer(seller, msg.sender, tokenId);

        // Transfer payment to seller
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "Payment transfer failed");

        // Refund excess payment
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }

        emit SkillSold(tokenId, seller, msg.sender, price);
        emit SkillTransferred(tokenId, seller, msg.sender);
    }

    function getSkillsForSale() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allSkills.length; i++) {
            if (skills[allSkills[i]].isForSale) {
                count++;
            }
        }

        uint256[] memory forSale = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allSkills.length; i++) {
            if (skills[allSkills[i]].isForSale) {
                forSale[index] = allSkills[i];
                index++;
            }
        }

        return forSale;
    }

    function getUserSkills(address user) public view returns (uint256[] memory) {
        return userSkills[user];
    }

    function getAllSkills() public view returns (uint256[] memory) {
        return allSkills;
    }

    function getSkill(uint256 tokenId) public view returns (Skill memory) {
        require(_exists(tokenId), "Skill does not exist");
        return skills[tokenId];
    }

    function _removeFromUserSkills(address user, uint256 tokenId) private {
        uint256[] storage userTokens = userSkills[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
