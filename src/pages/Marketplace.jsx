"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SkillCard from "../components/SkillCard"
import { useSkillContract } from "../hooks/useSkillContract"
import { useWeb3 } from "../contexts/Web3Context"
import "./Marketplace.css"

const Marketplace = () => {
  const { isConnected } = useWeb3()
  const { getSkillsForSale, buySkill, loading } = useSkillContract()
  const router = useRouter()

  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "all",
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

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-0.1", label: "0 - 0.1 ETH" },
    { value: "0.1-0.5", label: "0.1 - 0.5 ETH" },
    { value: "0.5-1", label: "0.5 - 1 ETH" },
    { value: "1+", label: "1+ ETH" },
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    filterSkills()
  }, [skills, searchTerm, categoryFilter, priceFilter])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const skillsForSale = await getSkillsForSale()
      setSkills(skillsForSale)
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSkills = () => {
    let filtered = [...skills]

    if (searchTerm) {
      filtered = filtered.filter((skill) => skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((skill) => skill.skillName.toLowerCase().includes(categoryFilter.toLowerCase()))
    }

    if (priceFilter !== "all") {
      const [min, max] = priceFilter
        .split("-")
        .map((p) => (p === "+" ? Number.POSITIVE_INFINITY : Number.parseFloat(p)))
      filtered = filtered.filter((skill) => {
        const price = Number.parseFloat(skill.price)
        return max ? price >= min && price <= max : price >= min
      })
    }

    setFilteredSkills(filtered)
  }

  const handleBuySkill = async (tokenId, price) => {
    const success = await buySkill(tokenId, price)
    if (success) {
      await fetchSkills()
    }
  }

  if (!isConnected) {
    return (
      <div className="marketplace-page">
        <div className="card max-w-4xl mx-auto">
          <div className="card-content text-center py-12">
            <div className="warning-icon">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to browse and purchase skills.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="marketplace-page">
      <div className="page-header">
        <h1 className="page-title">Skill Marketplace</h1>
        <p className="page-description">Discover and purchase tokenized skills from creators around the world</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="filters-grid">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                className="input search-input"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select className="select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setPriceFilter("all")
              }}
            >
              <span>🔄</span>
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <h2 className="results-title">{filteredSkills.length} Skills Available</h2>
          <button className="btn btn-outline" onClick={fetchSkills} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.tokenId} skill={skill} onBuy={handleBuySkill} showActions={true} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">
              {skills.length === 0 ? "No Skills for Sale" : "No Skills Match Your Filters"}
            </h3>
            <p className="empty-description">
              {skills.length === 0
                ? "Be the first to list a skill for sale!"
                : "Try adjusting your search criteria or clearing filters."}
            </p>
            {skills.length === 0 && (
              <button className="btn btn-primary" onClick={() => router.push("/mint")}>
                Mint a Skill
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
