"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "../contexts/Web3Context"
import toast from "react-hot-toast"

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0x..." // Replace with deployed address
const CONTRACT_ABI = [
  "function mintSkill(string memory skillName, string memory metadataURI) public returns (uint256)",
  "function transferSkill(address to, uint256 tokenId) public",
  "function listSkillForSale(uint256 tokenId, uint256 price) public",
  "function buySkill(uint256 tokenId) public payable",
  "function removeFromSale(uint256 tokenId) public",
  "function getSkillsForSale() public view returns (uint256[] memory)",
  "function getUserSkills(address user) public view returns (uint256[] memory)",
  "function getAllSkills() public view returns (uint256[] memory)",
  "function getSkill(uint256 tokenId) public view returns (tuple(uint256 tokenId, string skillName, address creator, uint256 price, bool isForSale, uint256 createdAt))",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event SkillMinted(uint256 indexed tokenId, string skillName, address indexed creator, string metadataURI)",
  "event SkillTransferred(uint256 indexed tokenId, address indexed from, address indexed to)",
  "event SkillListedForSale(uint256 indexed tokenId, uint256 price)",
  "event SkillSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)",
  "event SkillRemovedFromSale(uint256 indexed tokenId)",
]

export const useSkillContract = () => {
  const { provider, signer, account } = useWeb3()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (provider && signer) {
      const skillContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(skillContract)
    }
  }, [provider, signer])

  const mintSkill = async (skillName, description, category) => {
    if (!contract || !account) {
      toast.error("Please connect your wallet")
      return false
    }

    try {
      setLoading(true)

      // Create metadata object (in a real app, this would be uploaded to IPFS)
      const metadata = {
        name: skillName,
        description,
        category,
        creator: account,
        createdAt: Date.now(),
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${skillName}`, // Placeholder image
      }

      // In a real app, upload to IPFS and get the hash
      const metadataURI = `ipfs://mock-hash-${Date.now()}`

      const tx = await contract.mintSkill(skillName, metadataURI)
      toast.loading("Minting skill...", { id: "mint" })

      await tx.wait()
      toast.success("Skill minted successfully!", { id: "mint" })
      return true
    } catch (error) {
      console.error("Error minting skill:", error)
      toast.error(error.reason || "Failed to mint skill", { id: "mint" })
      return false
    } finally {
      setLoading(false)
    }
  }

  const listSkillForSale = async (tokenId, price) => {
    if (!contract) {
      toast.error("Contract not initialized")
      return false
    }

    try {
      setLoading(true)
      const priceInWei = ethers.parseEther(price)
      const tx = await contract.listSkillForSale(tokenId, priceInWei)
      toast.loading("Listing skill for sale...", { id: "list" })

      await tx.wait()
      toast.success("Skill listed for sale!", { id: "list" })
      return true
    } catch (error) {
      console.error("Error listing skill:", error)
      toast.error(error.reason || "Failed to list skill", { id: "list" })
      return false
    } finally {
      setLoading(false)
    }
  }

  const buySkill = async (tokenId, price) => {
    if (!contract) {
      toast.error("Contract not initialized")
      return false
    }

    try {
      setLoading(true)
      const priceInWei = ethers.parseEther(price)
      const tx = await contract.buySkill(tokenId, { value: priceInWei })
      toast.loading("Buying skill...", { id: "buy" })

      await tx.wait()
      toast.success("Skill purchased successfully!", { id: "buy" })
      return true
    } catch (error) {
      console.error("Error buying skill:", error)
      toast.error(error.reason || "Failed to buy skill", { id: "buy" })
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromSale = async (tokenId) => {
    if (!contract) {
      toast.error("Contract not initialized")
      return false
    }

    try {
      setLoading(true)
      const tx = await contract.removeFromSale(tokenId)
      toast.loading("Removing from sale...", { id: "remove" })

      await tx.wait()
      toast.success("Skill removed from sale!", { id: "remove" })
      return true
    } catch (error) {
      console.error("Error removing from sale:", error)
      toast.error(error.reason || "Failed to remove from sale", { id: "remove" })
      return false
    } finally {
      setLoading(false)
    }
  }

  const getSkillsForSale = async () => {
    if (!contract) return []

    try {
      const tokenIds = await contract.getSkillsForSale()
      const skills = []

      for (const tokenId of tokenIds) {
        const skillData = await contract.getSkill(tokenId)
        const owner = await contract.ownerOf(tokenId)
        const metadataURI = await contract.tokenURI(tokenId)

        skills.push({
          tokenId: Number(skillData.tokenId),
          skillName: skillData.skillName,
          creator: skillData.creator,
          price: ethers.formatEther(skillData.price),
          isForSale: skillData.isForSale,
          createdAt: Number(skillData.createdAt),
          owner,
          metadataURI,
        })
      }

      return skills
    } catch (error) {
      console.error("Error fetching skills for sale:", error)
      return []
    }
  }

  const getUserSkills = async (userAddress) => {
    if (!contract || (!account && !userAddress)) return []

    try {
      const address = userAddress || account
      const tokenIds = await contract.getUserSkills(address)
      const skills = []

      for (const tokenId of tokenIds) {
        const skillData = await contract.getSkill(tokenId)
        const metadataURI = await contract.tokenURI(tokenId)

        skills.push({
          tokenId: Number(skillData.tokenId),
          skillName: skillData.skillName,
          creator: skillData.creator,
          price: ethers.formatEther(skillData.price),
          isForSale: skillData.isForSale,
          createdAt: Number(skillData.createdAt),
          owner: address,
          metadataURI,
        })
      }

      return skills
    } catch (error) {
      console.error("Error fetching user skills:", error)
      return []
    }
  }

  const getAllSkills = async () => {
    if (!contract) return []

    try {
      const tokenIds = await contract.getAllSkills()
      const skills = []

      for (const tokenId of tokenIds) {
        const skillData = await contract.getSkill(tokenId)
        const owner = await contract.ownerOf(tokenId)
        const metadataURI = await contract.tokenURI(tokenId)

        skills.push({
          tokenId: Number(skillData.tokenId),
          skillName: skillData.skillName,
          creator: skillData.creator,
          price: ethers.formatEther(skillData.price),
          isForSale: skillData.isForSale,
          createdAt: Number(skillData.createdAt),
          owner,
          metadataURI,
        })
      }

      return skills
    } catch (error) {
      console.error("Error fetching all skills:", error)
      return []
    }
  }

  return {
    contract,
    loading,
    mintSkill,
    listSkillForSale,
    buySkill,
    removeFromSale,
    getSkillsForSale,
    getUserSkills,
    getAllSkills,
  }
}
