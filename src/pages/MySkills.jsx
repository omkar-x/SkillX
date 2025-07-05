"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import SkillCard from "../components/SkillCard"
import Modal from "../components/Modal"
import { useSkillContract } from "../hooks/useSkillContract"
import { useWeb3 } from "../contexts/Web3Context"
import "./MySkills.css"

const MySkills = () => {
  const { account, isConnected } = useWeb3()
  const { getUserSkills, listSkillForSale, removeFromSale, loading } = useSkillContract()

  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [listPrice, setListPrice] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (account) {
      fetchUserSkills()
    }
  }, [account])

  const fetchUserSkills = async () => {
    if (!account) return

    try {
      setIsLoading(true)
      const userSkills = await getUserSkills(account)
      setSkills(userSkills)
    } catch (error) {
      console.error("Error fetching user skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleListForSale = (skill) => {
    setSelectedSkill(skill)
    setListPrice("")
    setIsModalOpen(true)
  }

  const handleConfirmListing = async () => {
    if (!selectedSkill || !listPrice) return

    const success = await listSkillForSale(selectedSkill.tokenId, listPrice)
    if (success) {
      setIsModalOpen(false)
      setSelectedSkill(null)
      setListPrice("")
      await fetchUserSkills()
    }
  }

  const handleRemoveFromSale = async (tokenId) => {
    const success = await removeFromSale(tokenId)
    if (success) {
      await fetchUserSkills()
    }
  }

  if (!isConnected) {
    return (
      <div className="my-skills-page">
        <div className="card max-w-4xl mx-auto">
          <div className="card-content text-center py-12">
            <div className="warning-icon">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to view your skills.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  const listedSkills = skills.filter((skill) => skill.isForSale)
  const unlistedSkills = skills.filter((skill) => !skill.isForSale)

  return (
    <div className="my-skills-page">
      <div className="page-header">
        <h1 className="page-title">My Skills</h1>
        <p className="page-description">Manage your skill NFTs and trading activity</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value text-blue-600">{skills.length}</div>
          <div className="stat-label">Total Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-600">{listedSkills.length}</div>
          <div className="stat-label">Listed for Sale</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-purple-600">{unlistedSkills.length}</div>
          <div className="stat-label">Not Listed</div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skill-card-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line long"></div>
              </div>
            </div>
          ))}
        </div>
      ) : skills.length > 0 ? (
        <div className="skills-sections">
          {/* Listed Skills */}
          {listedSkills.length > 0 && (
            <div className="skills-section">
              <h2 className="section-title text-green-600">Listed for Sale</h2>
              <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                {listedSkills.map((skill) => (
                  <SkillCard
                    key={skill.tokenId}
                    skill={skill}
                    onRemoveFromSale={handleRemoveFromSale}
                    isOwner={true}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unlisted Skills */}
          {unlistedSkills.length > 0 && (
            <div className="skills-section">
              <h2 className="section-title text-gray-700">Your Skills</h2>
              <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                {unlistedSkills.map((skill) => (
                  <SkillCard
                    key={skill.tokenId}
                    skill={skill}
                    onList={handleListForSale}
                    isOwner={true}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3 className="empty-title">No Skills Yet</h3>
          <p className="empty-description">Start building your skill portfolio by minting your first NFT!</p>
          <Link href="/mint" className="btn btn-primary">
            <span>➕</span>
            <span>Mint Your First Skill</span>
          </Link>
        </div>
      )}

      {/* List for Sale Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="List Skill for Sale">
        <div className="modal-form">
          {selectedSkill && (
            <div className="selected-skill-info">
              <h3 className="skill-info-title">{selectedSkill.skillName}</h3>
              <p className="skill-info-id">Token ID: #{selectedSkill.tokenId}</p>
            </div>
          )}

          <div className="form-group">
            <label className="label" htmlFor="price">
              Price (ETH)
            </label>
            <input
              id="price"
              className="input"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
            />
            <p className="form-help">Set the price in ETH for your skill NFT</p>
          </div>

          <div className="modal-actions">
            <button
              onClick={handleConfirmListing}
              disabled={!listPrice || Number.parseFloat(listPrice) <= 0 || loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Listing..." : "List for Sale"}
            </button>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MySkills
