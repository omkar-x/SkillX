"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSkillContract } from "../hooks/useSkillContract"
import { useWeb3 } from "../contexts/Web3Context"
import "./MintSkill.css"

const MintSkill = () => {
  const router = useRouter()
  const { isConnected } = useWeb3()
  const { mintSkill, loading } = useSkillContract()

  const [formData, setFormData] = useState({
    skillName: "",
    description: "",
    category: "",
  })

  const categories = [
    "Programming",
    "Design",
    "Marketing",
    "Writing",
    "Business",
    "Data Science",
    "DevOps",
    "Mobile Development",
    "Web Development",
    "Blockchain",
    "AI/ML",
    "Other",
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.skillName.trim() || !formData.description.trim() || !formData.category) {
      return
    }

    const success = await mintSkill(formData.skillName.trim(), formData.description.trim(), formData.category)

    if (success) {
      setFormData({
        skillName: "",
        description: "",
        category: "",
      })
      router.push("/myskills")
    }
  }

  const isFormValid = formData.skillName.trim() && formData.description.trim() && formData.category

  if (!isConnected) {
    return (
      <div className="mint-skill-page">
        <div className="card max-w-2xl mx-auto">
          <div className="card-content text-center py-12">
            <div className="warning-icon">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to mint skill NFTs.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mint-skill-page">
      <div className="page-header">
        <h1 className="page-title">Mint Your Skill NFT</h1>
        <p className="page-description">Transform your expertise into a tradeable NFT on the blockchain</p>
      </div>

      <div className="mint-form-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="title-icon">✨</span>
              <span>Skill Details</span>
            </h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="mint-form">
              <div className="form-group">
                <label className="label" htmlFor="skillName">
                  Skill Name *
                </label>
                <input
                  id="skillName"
                  className="input"
                  placeholder="e.g., React Development, UI/UX Design, Smart Contract Auditing"
                  value={formData.skillName}
                  onChange={(e) => handleInputChange("skillName", e.target.value)}
                  maxLength={100}
                />
                <p className="form-help">{formData.skillName.length}/100 characters</p>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  className="textarea"
                  placeholder="Describe your skill, experience level, and what makes you unique in this area..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="form-help">{formData.description.length}/500 characters</p>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  className="select"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="alert alert-info">
                <span>📤</span>
                <div>
                  <strong>Note:</strong> In this demo, skill metadata is stored with placeholder IPFS URIs. In
                  production, metadata would be uploaded to IPFS for decentralized storage.
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={!isFormValid || loading} className="btn btn-primary flex-1">
                  {loading ? "Minting..." : "Mint Skill NFT"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => router.push("/")}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        {isFormValid && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Preview</h3>
            </div>
            <div className="card-content">
              <div className="preview-content">
                <div className="preview-image">
                  <div className="preview-image-content">
                    <span className="preview-icon">✨</span>
                    <p className="preview-name">{formData.skillName}</p>
                  </div>
                </div>
                <div className="preview-details">
                  <h3 className="preview-title">{formData.skillName}</h3>
                  <p className="preview-category">{formData.category}</p>
                  <p className="preview-description">{formData.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MintSkill
