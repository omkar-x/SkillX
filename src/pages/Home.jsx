"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import SkillCard from "../components/SkillCard"
import { useSkillContract } from "../hooks/useSkillContract"
import { useWeb3 } from "../contexts/Web3Context"
import "./Home.css"

const Home = () => {
  const { isConnected } = useWeb3()
  const { getAllSkills } = useSkillContract()
  const [recentSkills, setRecentSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentSkills = async () => {
      try {
        const skills = await getAllSkills()
        const recent = skills.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)
        setRecentSkills(recent)
      } catch (error) {
        console.error("Error fetching recent skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentSkills()
  }, [getAllSkills])

  const stats = [
    {
      title: "Skills Tokenized",
      value: recentSkills.length.toString(),
      description: "Unique skills minted as NFTs",
      icon: "⚡",
    },
    {
      title: "Active Listings",
      value: recentSkills.filter((skill) => skill.isForSale).length.toString(),
      description: "Skills currently for sale",
      icon: "📈",
    },
    {
      title: "Skill Creators",
      value: new Set(recentSkills.map((skill) => skill.creator)).size.toString(),
      description: "Unique creators on platform",
      icon: "👥",
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Trade Skills as NFTs</h1>
          <p className="hero-description">
            Tokenize your expertise, trade skills on the blockchain, and build a decentralized marketplace for human
            knowledge.
          </p>
        </div>

        <div className="hero-actions">
          {isConnected ? (
            <>
              <Link to="/mint" className="btn btn-primary btn-lg">
                <span>✨</span>
                <span>Mint Your First Skill</span>
              </Link>
              <Link href="/marketplace" className="btn btn-outline">
                  <span>View All</span>
                <span>*</span>
              </Link>
            </>
          ) : (
            <div className="connect-prompt">
              <p>Connect your wallet to get started</p>
              <button className="btn btn-lg" disabled>
                Connect Wallet First
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="grid grid-cols-1 md-grid-cols-3">
          {stats.map(({ title, value, description, icon }) => (
            <div key={title} className="stat-card">
              <div className="stat-icon">
                <span>{icon}</span>
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-title">{title}</div>
              <div className="stat-description">{description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Skills Section */}
      <section className="recent-skills-section">
        <div className="section-header">
          <h2 className="section-title">Recent Skills</h2>
          <Link href="/marketplace" className="btn btn-outline">
  <span>View All</span>
  <span>*</span>
</Link>
        </div>

        {loading ? (
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
        ) : recentSkills.length > 0 ? (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
            {recentSkills.map((skill) => (
              <SkillCard key={skill.tokenId} skill={skill} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <h3 className="empty-title">No Skills Yet</h3>
            <p className="empty-description">Be the first to mint a skill NFT!</p>
            {isConnected && (
              <Link to="/mint" className="btn btn-primary">
                Mint Your First Skill
              </Link>
            )}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title text-center">How It Works</h2>
        <div className="grid grid-cols-1 md-grid-cols-3">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Mint Your Skill</h3>
            <p className="step-description">
              Create an NFT representing your expertise. Add details about your skill and mint it on the blockchain.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number purple">2</div>
            <h3 className="step-title">List for Trade</h3>
            <p className="step-description">
              Set a price in ETH and list your skill NFT on the marketplace for others to discover and purchase.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number green">3</div>
            <h3 className="step-title">Trade & Earn</h3>
            <p className="step-description">
              Buy skills from others or sell your own. Build a portfolio of tokenized expertise and earn ETH.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
